import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Product } from '../entities/product.entity';
import { FindManyOptions, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';

/**
 * IProductRepository
 * @description Interface for Product repository
 */
export interface IProductRepository extends IBaseRepository<Product> {
  createQueryBuilder(alias?: string): SelectQueryBuilder<Product>;
  findOneBy(where: FindOptionsWhere<Product>): Promise<Product | null>;
}

