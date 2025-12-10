// Import typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Import entities
import { Product } from './product.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity({ name: 'product_warehouse' })
export class ProductWarehouse {
  // This is the primary key for the ProductWarehouse model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column - Relation with Product
  @ManyToOne(() => Product, (product) => product.productWarehouses)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // This a column - Relation with Warehouse
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.productWarehouses)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  // This a column
  @Column({ type: 'numeric', nullable: false, default: 0 })
  quantity: number;

  // This a column
  @CreateDateColumn()
  created_at: Date;

  // This a column
  @UpdateDateColumn()
  updated_at: Date;
}

