import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Warehouse } from '../entities/warehouse.entity';
import { FindOptionsWhere, SelectQueryBuilder } from 'typeorm';

/**
 * IWarehouseRepository
 * @description Interface for Warehouse repository
 */
export interface IWarehouseRepository extends IBaseRepository<Warehouse> {
  findOneBy(where: FindOptionsWhere<Warehouse>): Promise<Warehouse | null>;
  findBy(where: FindOptionsWhere<Warehouse>): Promise<Warehouse[]>;
  createQueryBuilder(alias?: string): SelectQueryBuilder<Warehouse>;
}

