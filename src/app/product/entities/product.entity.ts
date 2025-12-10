// Import typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Import entities
import { ProductWarehouse } from './product-warehouse.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  // This is the primary key for the Product model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column
  @Column({ length: 50, nullable: false, unique: true })
  code: string;

  // This a column
  @Column({ length: 150, nullable: false })
  name: string;

  // This a column
  @Column({ type: 'text', nullable: false })
  description: string;

  // This a column
  @Column({ length: 50, nullable: false })
  packagingUnit: string;

  // This a column
  @Column({ type: 'numeric', nullable: false })
  conversionFactor: number;

  // This a column
  @Column({ type: 'numeric', nullable: false })
  price: number;

  // This a column
  @Column({ default: true })
  active?: boolean;

  // This a column - Relation OneToMany with ProductWarehouse
  @OneToMany(() => ProductWarehouse, (productWarehouse) => productWarehouse.product)
  productWarehouses?: ProductWarehouse[];

  // This a column - Relation with User (created by)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  // This a column - Relation with User (updated by)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User;

  // This a column
  @CreateDateColumn()
  created_at: Date;

  // This a column
  @UpdateDateColumn()
  updated_at: Date;
}

