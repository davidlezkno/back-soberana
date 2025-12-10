import { Departments } from "src/app/states/entities/departments.entity"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"



@Entity("cities")
export class Cities {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "name", unique: false, length: 50 })
  name: string

  @Column({ name: "code", unique: true, length: 50 })
  code: string

  @ManyToOne(() => Departments, (r) => r.city)
  @JoinColumn({ name: "department_id" })
  department: Departments

  @Column({ name: "is_active", default: true })
  isActive: boolean

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt: Date

}