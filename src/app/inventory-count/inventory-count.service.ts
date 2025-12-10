import { Injectable, Inject } from '@nestjs/common';
import { DeepPartial, Raw } from 'typeorm';
import { InventoryCountRepository } from './repositories/inventory-count.repository';
import { IInventoryCountRepository } from './interfaces/inventory-count.repository.interface';
import { InventoryCount } from './entities/inventory-count.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { User } from '../users/entities/user.entity';
import { CreateInventoryCountDto } from './dto/create-inventory-count.dto';
import { Exception } from '../../utils/exception.utility';
import { exceptions } from './constants';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Injectable()
export class InventoryCountService {
  constructor(
    @Inject(REPOSITORY_TOKENS.INVENTORY_COUNT_REPOSITORY)
    private readonly inventoryCountRepository: IInventoryCountRepository
  ) {}

  /**
   * Create
   * @description Create a new record
   * @param  {CreateInventoryCountDto} createInventoryCountDto
   * @param  {User} user
   */
  async create(
    createInventoryCountDto: CreateInventoryCountDto,
    user: User
  ) {
    // Prepare data
    const data: DeepPartial<InventoryCount> = {
      warehouse: { id: createInventoryCountDto.warehouseId } as Warehouse,
      cutOffDate: createInventoryCountDto.cutOffDate,
      countNumber: createInventoryCountDto.countNumber,
      status: createInventoryCountDto.status !== undefined ? createInventoryCountDto.status : true,
      createdBy: user,
    };

    const result = await this.inventoryCountRepository
      .save(data)
      .catch((error) => {
        if (error.code === '23505')
          throw Exception(
            error.detail.includes('code')
              ? exceptions.duplicated
              : exceptions.duplicatedCode
          );

        throw Exception(exceptions.error_save, [], error);
      });

    // Ensure result is a single InventoryCount (not an array)
    const savedInventoryCount = Array.isArray(result) ? result[0] : result;

    const cutOffDate = savedInventoryCount.cutOffDate || createInventoryCountDto.cutOffDate;
    const year = cutOffDate.getFullYear();
    const month = String(cutOffDate.getMonth() + 1).padStart(2, '0');

    const allCountsFromMonth = await this.inventoryCountRepository
      .find({
        where: {
          warehouse: { id: createInventoryCountDto.warehouseId } as Warehouse,
          cutOffDate: Raw(
            (alias) =>
              `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month}`
          ),
        },
        relations: ['warehouse', 'createdBy'],
        order: { countNumber: 'ASC' },
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    return allCountsFromMonth;
  }

  /**
   * FindByWarehouse
   * @description Get all inventory counts by warehouse id filtered by cutOffDate month
   * @param  {string} warehouseId
   * @param  {string} countDate
   */
  async findByWarehouse(warehouseId: string, countDate?: string) {
    let year: number;
    let month: string;

    if (countDate) {
      let dateString = countDate.trim();
      
      if (dateString.startsWith('"') && dateString.endsWith('"')) {
        dateString = dateString.slice(1, -1);
      }
      
      if (dateString.startsWith("'") && dateString.endsWith("'")) {
        dateString = dateString.slice(1, -1);
      }
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        throw Exception(exceptions.bad_request);
      }
      
      year = date.getFullYear();
      month = String(date.getMonth() + 1).padStart(2, '0');
    } else {
      const currentDate = new Date();
      year = currentDate.getFullYear();
      month = String(currentDate.getMonth() + 1).padStart(2, '0');
    }

    const result = await this.inventoryCountRepository
      .find({
        where: {
          warehouse: { id: warehouseId } as Warehouse,
          cutOffDate: Raw(
            (alias) =>
              `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month}`
          ),
        },
        relations: ['warehouse', 'createdBy'],
        order: { countNumber: 'ASC' },
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const length = await this.inventoryCountRepository
      .count({
        where: {
          warehouse: { id: warehouseId } as Warehouse,
          cutOffDate: Raw(
            (alias) =>
              `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month}`
          ),
        },
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    return { items: result, length };
  }

  /**
   * Finish
   * @description Update status to false for an inventory count
   * @param  {string} inventoryId
   */
  async finish(inventoryId: string) {
    // Find record
    const find = await this.inventoryCountRepository
      .findOneBy({ id: inventoryId })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // If not found
    if (!find) throw Exception(exceptions.not_found, []);

    // Update status to false
    const result = await this.inventoryCountRepository
      .save({ ...find, status: false })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_update, [], error);
      });

    // Ensure result is a single InventoryCount (not an array)
    const savedInventoryCount = Array.isArray(result) ? result[0] : result;

    // Reload the record with relations
    const updated = await this.inventoryCountRepository
      .findOne({
        where: { id: savedInventoryCount.id },
        relations: ['warehouse', 'createdBy'],
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // Return result
    return updated || savedInventoryCount;
  }
}

