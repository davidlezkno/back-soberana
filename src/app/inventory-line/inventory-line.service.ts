import { Injectable, Inject } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  Raw,
} from 'typeorm';
import { InventoryLineRepository } from './repositories/inventory-line.repository';
import { IInventoryLineRepository } from './interfaces/inventory-line.repository.interface';
import { InventoryLine } from './entities/inventory-line.entity';
import { InventoryCount } from '../inventory-count/entities/inventory-count.entity';
import { Product } from '../product/entities/product.entity';
import { CreateInventoryLineDto } from './dto/create-inventory-line.dto';
import { SelectInventoryLineDto } from './dto/select-inventory-line.dto';
import { UpdateInventoryLineDto } from './dto/update-inventory-line.dto';
import PermissionUtility from 'src/utils/permission.utility';
import { Exception } from '../../utils/exception.utility';
import { exceptions } from './constants';
import { User } from '../users/entities/user.entity';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Injectable()
export class InventoryLineService {
  constructor(
    @Inject(REPOSITORY_TOKENS.INVENTORY_LINE_REPOSITORY)
    private readonly inventoryLineRepository: IInventoryLineRepository
  ) {}

  /**
   * Create
   * @description Create a new record
   * @param  {CreateInventoryLineDto} createInventoryLineDto
   * @param  {User} user
   */
  async create(createInventoryLineDto: CreateInventoryLineDto, user: User) {
    // Prepare data
    const data: DeepPartial<InventoryLine> = {
      inventoryCount: { id: createInventoryLineDto.inventoryCountId } as InventoryCount,
      product: { id: createInventoryLineDto.productId } as Product,
      quantityPackaging: createInventoryLineDto.quantityPackaging,
      quantityUnits: createInventoryLineDto.quantityUnits,
    };

    // Save record
    const result = await this.inventoryLineRepository.save(data)
      .catch((error) => {
        // Catch error in database transaction duplicated
        if (error.code === '23505')
          throw Exception(
            error.detail.includes('code')
              ? exceptions.duplicated
              : exceptions.duplicatedCode
          );

        // Catch error in database transaction
        throw Exception(exceptions.error_save, [], error);
      });

    // Ensure result is a single InventoryLine (not an array)
    const savedInventoryLine = Array.isArray(result) ? result[0] : result;

    // Return result
    return savedInventoryLine;
  }

  /**
   * FindAll
   * @description Get all records
   * @param  {SelectInventoryLineDto} query
   * @param  {User} user
   */
  async findAll(
    {
      inventoryCountId,
      productId,
      search,
      created_at,
      limit = 20,
      page = 0,
    }: SelectInventoryLineDto,
    user: User
  ) {
    const permission = PermissionUtility(user);

    if (permission.user.id.length === 0) return [];

    const andConditions: FindOptionsWhere<InventoryLine> = {};
    const orConditions: FindOptionsWhere<InventoryLine>[] = [];

    // If search exists
    if (search) {
      orConditions.push(
        { quantityPackaging: Raw((alias) => `CAST(${alias} AS TEXT) ILIKE '%${search.replace(/'/g, "''")}%'`) },
        { quantityUnits: Raw((alias) => `CAST(${alias} AS TEXT) ILIKE '%${search.replace(/'/g, "''")}%'`) }
      );
    }

    if (inventoryCountId) andConditions.inventoryCount = { id: inventoryCountId } as any;
    if (productId) andConditions.product = { id: productId } as any;

    if (created_at) {
      const [year, month] = created_at.split('T')[0].split('-');
      let day = created_at.split('T')[0].split('-')[2];
      const [hour] = created_at.split('T')[1].replace('Z', '').split(':');

      if (parseInt(hour, 10) + 5 >= 24) {
        day = String(parseInt(day, 10) + 1).padStart(2, '0');
      }

      const adjustedStart = `${year}-${month}-${day} 00:00:00`;
      const adjustedEnd = `${year}-${month}-${day} 23:59:59`;

      andConditions.created_at = Raw(
        (alias) =>
          `DATE(${alias} - INTERVAL '5 hours') BETWEEN '${adjustedStart}'::TIMESTAMP 
            AND '${adjustedEnd}'::TIMESTAMP`
      );
    }

    const where =
      orConditions.length > 0
        ? { ...andConditions, OR: orConditions }
        : andConditions;

    // Initialize search
    const init_search: FindManyOptions<InventoryLine> = {
      where,
      relations: ['inventoryCount', 'product'],
      skip: limit * page,
      take: limit,
      order: { created_at: 'DESC' },
    };

    // Clear the where if it is empty
    if (
      !init_search.where ||
      (Array.isArray(init_search.where) && init_search.where.length === 0)
    )
      delete init_search.where;

    // Save record
    const result = await this.inventoryLineRepository
      .find(init_search)
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    const length = await this.inventoryLineRepository.count({ where });

    // Return result
    return { items: result, length };
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   */
  async findOne(id: string, isRequired = true) {
    // Find record
    const result = await this.inventoryLineRepository
      .findOne({
        where: { id: id },
        relations: ['inventoryCount', 'product'],
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // If not found
    if (!result && isRequired) throw Exception(exceptions.not_found, []);

    // Return result
    return result;
  }

  /**
   * Update
   * @description Update one record
   * @param  {string} id
   * @param  {UpdateInventoryLineDto} updateInventoryLineDto
   * @param  {User} user
   */
  async update(id: string, updateInventoryLineDto: UpdateInventoryLineDto, user: User) {
    // Save record
    const find = await this.inventoryLineRepository
      .findOneBy({ id: id })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // If not found
    if (!find) throw Exception(exceptions.not_found, []);

    // Build update data without copying the entire object
    const data: DeepPartial<InventoryLine> = {
      id: find.id,
    };

    if (updateInventoryLineDto.inventoryCountId) {
      data.inventoryCount = { id: updateInventoryLineDto.inventoryCountId } as InventoryCount;
    }
    if (updateInventoryLineDto.productId) {
      data.product = { id: updateInventoryLineDto.productId } as Product;
    }
    if (updateInventoryLineDto.quantityPackaging !== undefined) {
      data.quantityPackaging = updateInventoryLineDto.quantityPackaging;
    }
    if (updateInventoryLineDto.quantityUnits !== undefined) {
      data.quantityUnits = updateInventoryLineDto.quantityUnits;
    }

    // Save record
    const result = await this.inventoryLineRepository.save(data).catch((error) => {
      // Catch error in database transaction duplicated
      if (error.code === '23505')
        throw Exception(
          error.detail.includes('code')
            ? exceptions.duplicated
            : exceptions.duplicatedCode
        );

      // Catch error in database transaction
      throw Exception(exceptions.error_update, [], error);
    });

    // Ensure result is a single InventoryLine (not an array)
    const savedInventoryLine = Array.isArray(result) ? result[0] : result;

    // Reload the record to ensure data is updated
    const updated = await this.inventoryLineRepository
      .findOne({
        where: { id: savedInventoryLine.id },
        relations: ['inventoryCount', 'product'],
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // Return result with updated data
    return updated || savedInventoryLine;
  }

  /**
   * FindByInventoryCountId
   * @description Get all records by inventory count id
   * @param  {string} inventoryCountId
   */
  async findByInventoryCountId(inventoryCountId: string) {
    const result = await this.inventoryLineRepository
      .find({
        where: { inventoryCount: { id: inventoryCountId } as InventoryCount },
        relations: ['inventoryCount', 'product'],
        order: { created_at: 'DESC' },
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    return { items: result, length: result.length };
  }

  /**
   * Remove
   * @description Remove one record
   * @param  {string} id
   * @param  {User} user
   */
  async remove(id: string, user: User) {
    // Save record
    const find = await this.inventoryLineRepository
      .findOneBy({ id: id })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // If not found
    if (!find) throw Exception(exceptions.not_found, []);

    // Delete record
    const result = await this.inventoryLineRepository
      .remove(find)
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_delete, [], error);
      });

    // Return result
    return result;
  }
}

