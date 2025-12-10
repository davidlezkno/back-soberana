import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IProductRepository } from '../interfaces/product.repository.interface';

@Injectable()
export class ProductRepository extends Repository<Product> implements IProductRepository {
  constructor(protected dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }
}

