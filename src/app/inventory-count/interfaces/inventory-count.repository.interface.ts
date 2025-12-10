import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { InventoryCount } from '../entities/inventory-count.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * IInventoryCountRepository
 * @description Interface for InventoryCount repository
 */
export interface IInventoryCountRepository extends IBaseRepository<InventoryCount> {
  findOneBy(where: FindOptionsWhere<InventoryCount>): Promise<InventoryCount | null>;
}

