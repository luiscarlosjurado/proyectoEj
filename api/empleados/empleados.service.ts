import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const empleado = this.empleadoRepository.create({
      nombre: createEmpleadoDto.nombre,
      apellido: createEmpleadoDto.apellido,
      email: createEmpleadoDto.email,
      departamento: { id: createEmpleadoDto.departamento_id },
      cargo: { id: createEmpleadoDto.cargo_id },
    });

    return this.empleadoRepository.save(empleado);
  }

  async findAll() {
    return this.empleadoRepository.find({
      relations: {
        departamento: true,
        cargo: true,
        contrato: {
          beneficios: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: {
        departamento: true,
        cargo: true,
        contrato: {
          beneficios: true,
        },
      },
    });

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const salarioBase = Number(empleado.cargo.salario_base);

    const totalBeneficios =
      empleado.contrato?.beneficios?.reduce(
        (total, beneficio) => total + Number(beneficio.valor),
        0,
      ) ?? 0;

    const salarioTotal = salarioBase + totalBeneficios;

    return {
      id: empleado.id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,

      departamento: empleado.departamento,
      cargo: empleado.cargo,

      contrato: empleado.contrato
        ? {
            id: empleado.contrato.id,
            fecha_inicio: empleado.contrato.fecha_inicio,
            beneficios: empleado.contrato.beneficios,
          }
        : null,

      salario_base: salarioBase,
      total_beneficios: totalBeneficios,
      salario_total: salarioTotal,
    };
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: {
        departamento: true,
        cargo: true,
        contrato: {
          beneficios: true,
        },
      },
    });

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    if (updateEmpleadoDto.nombre !== undefined) {
      empleado.nombre = updateEmpleadoDto.nombre;
    }

    if (updateEmpleadoDto.apellido !== undefined) {
      empleado.apellido = updateEmpleadoDto.apellido;
    }

    if (updateEmpleadoDto.email !== undefined) {
      empleado.email = updateEmpleadoDto.email;
    }

    if (updateEmpleadoDto.departamento_id !== undefined) {
      empleado.departamento = {
        id: updateEmpleadoDto.departamento_id,
      } as any;
    }

    if (updateEmpleadoDto.cargo_id !== undefined) {
      empleado.cargo = {
        id: updateEmpleadoDto.cargo_id,
      } as any;
    }

    return this.empleadoRepository.save(empleado);
  }

  async remove(id: number) {
    const empleado = await this.empleadoRepository.findOneBy({ id });

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    await this.empleadoRepository.remove(empleado);

    return {
      mensaje: 'Empleado eliminado correctamente',
    };
  }
}
