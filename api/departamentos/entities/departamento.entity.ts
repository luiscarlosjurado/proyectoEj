import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';

@Entity('departamentos')
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;

  @OneToMany(() => Empleado, (empleado) => empleado.departamento)
  empleados: Empleado[];
}