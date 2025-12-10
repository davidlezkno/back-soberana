import { Departments } from "src/app/states/entities/departments.entity"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"


@Entity("countries")
export class Countries {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "name", unique: true, length: 50 })
  name: string

  @Column({ name: "code", unique: true, length: 50 })
  code: string

  @OneToMany(() => Departments, (department) => department.country, {
    cascade: true,
  })
  department: Departments[]

  @Column({ name: "is_active", default: true })
  isActive: boolean

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt: Date

}
