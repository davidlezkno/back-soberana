import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { InventoryLine } from '../entities/inventory-line.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * IInventoryLineRepository
 * @description Interface for InventoryLine repository
 */
export interface IInventoryLineRepository extends IBaseRepository<InventoryLine> {
  findOneBy(where: FindOptionsWhere<InventoryLine>): Promise<InventoryLine | null>;
}

