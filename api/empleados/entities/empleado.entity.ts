import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Departamento } from '../../departamentos/entities/departamento.entity';
import { Cargo } from '../../cargos/entities/cargo.entity';
import { Contrato } from '../../contratos/entities/contrato.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 150, unique: true })
  email: string;

  @ManyToOne(() => Departamento)
  @JoinColumn({ name: 'departamento_id' })
  departamento: Departamento;

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: 'cargo_id' })
  cargo: Cargo;

  @OneToOne(() => Contrato, (contrato) => contrato.empleado)
  contrato: Contrato;
}