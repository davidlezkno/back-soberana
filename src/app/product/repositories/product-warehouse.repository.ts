import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductWarehouse } from '../entities/product-warehouse.entity';
import { IProductWarehouseRepository } from '../interfaces/product-warehouse.repository.interface';

@Injectable()
export class ProductWarehouseRepository extends Repository<ProductWarehouse> implements IProductWarehouseRepository {
  constructor(protected dataSource: DataSource) {
    super(ProductWarehouse, dataSource.createEntityManager());
  }
}

