import { Injectable, Inject } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { IWarehouseRepository } from './interfaces/warehouse.repository.interface';
import { Warehouse } from './entities/warehouse.entity';
import { Cities } from '../cities/entities/cities.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { SelectWarehouseDto } from './dto/select-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Exception } from '../../utils/exception.utility';
import { exceptions } from './constants';
import { User } from '../users/entities/user.entity';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';
import { WarehouseSearchService } from './services/warehouse-search.service';
import { WarehouseUserService } from './services/warehouse-user.service';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly warehouseSearchService: WarehouseSearchService,
    private readonly warehouseUserService: WarehouseUserService
  ) {}

  /**
   * Create
   * @description Create a new record
   * @param  {CreateWarehouseDto} createWarehouseDto
   */
  async create(createWarehouseDto: CreateWarehouseDto) {
    const data: DeepPartial<Warehouse> = {
      code: createWarehouseDto.code.trim(),
      name: createWarehouseDto.name.trim(),
      address: createWarehouseDto.address?.trim(),
      phone: createWarehouseDto.phone?.trim(),
    };

    if (createWarehouseDto.cityId) {
      data.city = { id: createWarehouseDto.cityId } as Cities;
    }

    const result = await this.warehouseRepository.save(data)
      .catch((error) => {
        if (error.code === '23505')
          throw Exception(
            error.detail.includes('code')
              ? exceptions.duplicated
              : exceptions.duplicatedCode
          );

        throw Exception(exceptions.error_save, [], error);
      });

    const savedWarehouse = Array.isArray(result) ? result[0] : result;

    return savedWarehouse;
  }

  /**
   * FindAll
   * @description Get all records
   * @param  {SelectWarehouseDto} query
   * @param  {User} user
   */
  async findAll(query: SelectWarehouseDto, user: User) {
    return this.warehouseSearchService.findAll(query, user);
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   * @param  {boolean} isRequired
   */
  async findOne(id: string, isRequired = true) {
    return this.warehouseSearchService.findOne(id, isRequired);
  }

  /**
   * FindOneByCode
   * @description Get one record by code
   * @param  {string} code
   * @param  {boolean} isRequired
   */
  async findOneByCode(code: string, isRequired = true) {
    return this.warehouseSearchService.findOneByCode(code, isRequired);
  }

  /**
   * FindOneBy
   * @description Get one or multiple records with pagination support
   * @param  {FindOptionsWhere<Warehouse>} where
   * @param  {number} limit
   * @param  {number} page
   */
  async findOneBy(
    where: FindOptionsWhere<Warehouse>,
    limit?: number,
    page?: number
  ) {
    return this.warehouseSearchService.findOneBy(where, limit, page);
  }

  /**
   * FindByUser
   * @description Get all warehouses by user id
   * @param  {string} userId
   */
  async findByUser(userId: string) {
    return this.warehouseUserService.findByUser(userId);
  }

  /**
   * Update
   * @description Update one record
   * @param  {string} id
   * @param  {UpdateWarehouseDto} updateWarehouseDto
   */
  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    const find = await this.warehouseRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const data: DeepPartial<Warehouse> = {
      id: find.id,
    };

    if (updateWarehouseDto.code) data.code = updateWarehouseDto.code.trim();
    if (updateWarehouseDto.name) data.name = updateWarehouseDto.name.trim();
    if (updateWarehouseDto.address !== undefined)
      data.address = updateWarehouseDto.address?.trim();
    if (updateWarehouseDto.city !== undefined) {
      data.city = { id: updateWarehouseDto.city } as Cities;
    }
    if (updateWarehouseDto.phone !== undefined)
      data.phone = updateWarehouseDto.phone?.trim();

    const result = await this.warehouseRepository.save(data).catch((error) => {
      if (error.code === '23505')
        throw Exception(
          error.detail.includes('code')
            ? exceptions.duplicated
            : exceptions.duplicatedCode
        );

      throw Exception(exceptions.error_update, [], error);
    });

    const savedWarehouse = Array.isArray(result) ? result[0] : result;

    const updated = await this.warehouseRepository
      .findOne({
        where: { id: savedWarehouse.id },
        relations: ['city'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    return updated || savedWarehouse;
  }

  /**
   * Remove
   * @description Remove one record
   * @param  {string} id
   */
  async remove(id: string) {
    const find = await this.warehouseRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const result = await this.warehouseRepository
      .save({ ...find, active: false })
      .catch((error) => {
        throw Exception(exceptions.error_delete, [], error);
      });

    return result;
  }

  /**
   * Reactivate
   * @description Reactivate one record
   * @param  {string} id
   */
  async reactivate(id: string) {
    const find = await this.warehouseRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const result = await this.warehouseRepository
      .save({ ...find, active: true })
      .catch((error) => {
        throw Exception(exceptions.error_delete, [], error);
      });

    return result;
  }
}

