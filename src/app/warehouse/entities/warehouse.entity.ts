// Import typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

// Import entities
import { Cities } from '../../cities/entities/cities.entity';
import { User } from '../../users/entities/user.entity';
import { ProductWarehouse } from '../../product/entities/product-warehouse.entity';

@Entity({ name: 'warehouses' })
export class Warehouse {
  // This is the primary key for the Warehouse model
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This a column
  @Column({ length: 50, nullable: false, unique: true })
  code: string;

  // This a column
  @Column({ length: 150, nullable: false })
  name: string;

  // This a column
  @Column({ length: 255, nullable: true })
  address?: string;

  // This a column - Relation with Cities
  @ManyToOne(() => Cities, { eager: true, nullable: true })
  @JoinColumn({ name: 'city_id' })
  city?: Cities;

  // This a column
  @Column({ length: 20, nullable: true })
  phone?: string;

  // This a column
  @Column({ default: true })
  active?: boolean;

  // This a column - Relation ManyToMany with User
  @ManyToMany(() => User, (user) => user.warehouses)
  users?: User[];

  // This a column - Relation OneToMany with ProductWarehouse
  @OneToMany(() => ProductWarehouse, (productWarehouse) => productWarehouse.warehouse)
  productWarehouses?: ProductWarehouse[];

  // This a column
  @CreateDateColumn()
  created_at: Date;

  // This a column
  @UpdateDateColumn()
  updated_at: Date;
}

