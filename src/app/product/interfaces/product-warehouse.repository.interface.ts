import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { ProductWarehouse } from '../entities/product-warehouse.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * IProductWarehouseRepository
 * @description Interface for ProductWarehouse repository
 */
export interface IProductWarehouseRepository extends IBaseRepository<ProductWarehouse> {
  findOneBy(where: FindOptionsWhere<ProductWarehouse>): Promise<ProductWarehouse | null>;
}

