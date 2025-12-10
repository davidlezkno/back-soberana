// Import typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

// Import entities
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity({ name: 'users' })
export class User {
  // This is the primary key for the Set model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column
  @Column({ length: 150, nullable: false, unique: true })
  document: string;

  // This a column
  @Column({ length: 150, nullable: false })
  name: string;

  // This a column
  @Column({ length: 150, nullable: true })
  surname: string;

  // This a column
  @Column({ length: 150, unique: true, nullable: false })
  username: string;

  // This a column
  @Column({ length: 255, nullable: false })
  password: string;

  // This a column
  @Column({ length: 20, default: 'agent' })
  type: string;

  // This a column
  @Column({ default: true })
  active?: boolean;

  // This a column
  @CreateDateColumn()
  created_at: Date;

  // This a column
  @CreateDateColumn()
  last_password_change: Date;

  // This a column
  @Column({ default: false })
  password_change?: boolean;

  // This a column - Relation ManyToMany with Warehouse
  @ManyToMany(() => Warehouse, (warehouse) => warehouse.users)
  @JoinTable({
    name: 'user_warehouse',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'warehouse_id', referencedColumnName: 'id' },
  })
  warehouses?: Warehouse[];

  // This a column
  @UpdateDateColumn()
  updated_at: Date;
}

