import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  async create(createDepartamentoDto: CreateDepartamentoDto) {
    const departamento = this.departamentoRepository.create(
      createDepartamentoDto,
    );

    return this.departamentoRepository.save(departamento);
  }

  async findAll() {
    return this.departamentoRepository.find();
  }

  async findOne(id: number) {
    const departamento = await this.departamentoRepository.findOneBy({ id });

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    return departamento;
  }

  async update(id: number, updateDepartamentoDto: UpdateDepartamentoDto) {
    const departamento = await this.findOne(id);

    Object.assign(departamento, updateDepartamentoDto);

    return this.departamentoRepository.save(departamento);
  }

  async remove(id: number) {
    const departamento = await this.findOne(id);

    await this.departamentoRepository.remove(departamento);

    return {
      mensaje: 'Departamento eliminado correctamente',
    };
  }
}