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
import { InventoryCount } from '../../inventory-count/entities/inventory-count.entity';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'inventory_lines' })
export class InventoryLine {
  // This is the primary key for the InventoryLine model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column - Relation with InventoryCount
  @ManyToOne(() => InventoryCount)
  @JoinColumn({ name: 'inventory_count_id' })
  inventoryCount: InventoryCount;

  // This a column - Relation with Product
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // This a column
  @Column({ type: 'numeric', nullable: false })
  quantityPackaging: number;

  // This a column
  @Column({ type: 'numeric', nullable: false })
  quantityUnits: number;

  // This a column
  @CreateDateColumn()
  created_at: Date;
}

