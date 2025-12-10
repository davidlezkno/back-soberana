import { Injectable, Inject } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  Raw,
} from 'typeorm';
import { IWarehouseRepository } from '../interfaces/warehouse.repository.interface';
import { Warehouse } from '../entities/warehouse.entity';
import { SelectWarehouseDto } from '../dto/select-warehouse.dto';
import PermissionUtility from 'src/utils/permission.utility';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';
import { User } from '../../users/entities/user.entity';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class WarehouseSearchService {
  constructor(
    @Inject(REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository
  ) {}

  /**
   * FindAll
   * @description Get all records
   * @param  {SelectWarehouseDto} query
   * @param  {User} user
   */
  async findAll(
    {
      code,
      name,
      cityId,
      active,
      search,
      created_at,
      limit = 20,
      page = 0,
    }: SelectWarehouseDto,
    user: User
  ) {
    const permission = PermissionUtility(user);

    if (permission.user.id.length === 0) return { items: [], length: 0 };

    const andConditions: FindOptionsWhere<Warehouse> = {};
    const orConditions: FindOptionsWhere<Warehouse>[] = [];

    if (search) {
      orConditions.push(
        { code: ILike(`%${search}%`) },
        { name: ILike(`%${search}%`) }
      );
    }

    if (code) andConditions.code = code;
    if (name) andConditions.name = ILike(`%${name}%`);
    if (cityId) andConditions.city = { id: cityId } as any;
    if (active !== undefined) andConditions.active = active;

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

    const init_search: FindManyOptions<Warehouse> = {
      where,
      relations: ['city'],
      skip: limit * page,
      take: limit,
      order: { created_at: 'DESC' },
    };

    if (
      !init_search.where ||
      (Array.isArray(init_search.where) && init_search.where.length === 0)
    )
      delete init_search.where;

    const result = await this.warehouseRepository
      .find(init_search)
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const length = await this.warehouseRepository.count({ where });

    return { items: result, length };
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   * @param  {boolean} isRequired
   */
  async findOne(id: string, isRequired = true) {
    const result = await this.warehouseRepository
      .findOne({
        where: { id: id },
        relations: ['city'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result && isRequired) throw Exception(exceptions.not_found, []);

    return result;
  }

  /**
   * FindOneByCode
   * @description Get one record by code
   * @param  {string} code
   * @param  {boolean} isRequired
   */
  async findOneByCode(code: string, isRequired = true) {
    const result = await this.warehouseRepository
      .findOne({
        where: { code: code },
        relations: ['city'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result && isRequired) throw Exception(exceptions.not_found, []);

    return result;
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
    if (limit !== undefined && page !== undefined) {
      const init_search: FindManyOptions<Warehouse> = {
        where,
        relations: ['city'],
        skip: limit * page,
        take: limit,
        order: { created_at: 'DESC' },
      };

      if (
        !init_search.where ||
        (Array.isArray(init_search.where) && init_search.where.length === 0)
      )
        delete init_search.where;

      const result = await this.warehouseRepository
        .find(init_search)
        .catch((error) => {
          throw Exception(exceptions.error_find, [], error);
        });

      const length = await this.warehouseRepository.count({ where });

      return { items: result, length };
    }

    const result = await this.warehouseRepository
      .findOne({
        where,
        relations: ['city'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result) throw Exception(exceptions.not_found, []);

    return result;
  }
}

