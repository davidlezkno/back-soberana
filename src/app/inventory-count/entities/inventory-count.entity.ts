// Import typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Import entities
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'inventory_counts' })
export class InventoryCount {
  // This is the primary key for the InventoryCount model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column - Relation with Warehouse
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  // This a column
  @Column({ type: 'date', nullable: false })
  cutOffDate: Date;

  // This a column
  @Column({ type: 'int', nullable: false })
  countNumber: number;

  // This a column
  @Column({ type: 'boolean', default: true })
  status?: boolean;

  // This a column - Relation with User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  // This a column
  @CreateDateColumn()
  created_at: Date;
}

