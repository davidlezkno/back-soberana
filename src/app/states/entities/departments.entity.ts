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
import { Countries } from "../../countries/entities/countries.entity"
import { Cities } from "../../cities/entities/cities.entity"


@Entity("departments")
export class Departments {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "name", unique: true, length: 50 })
  name: string

  @Column({ name: "code", unique: true, length: 50 })
  code: string

  @Column({ name: "is_active", default: true })
  isActive: boolean

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt: Date

  @ManyToOne(() => Countries, (r) => r.department, { eager: true })
  @JoinColumn({ name: "country_id" })
  country: Countries

  @OneToMany(() => Cities, (cities) => cities.department, {
    cascade: true,
  })
  city: Cities[]

}
