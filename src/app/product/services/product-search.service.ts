import { Injectable, Inject } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  Raw,
} from 'typeorm';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { IUserRepository } from '../../users/interfaces/user.repository.interface';
import { Product } from '../entities/product.entity';
import { SelectProductDto } from '../dto/select-product.dto';
import PermissionUtility from 'src/utils/permission.utility';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';
import { User } from '../../users/entities/user.entity';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class ProductSearchService {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * FindAll
   * @description Get all records with filters
   * @param  {SelectProductDto} query
   * @param  {User} user
   */
  async findAll(
    {
      code,
      name,
      description,
      packagingUnit,
      active,
      search,
      created_at,
      warehouse,
      limit = 20,
      page = 0,
    }: SelectProductDto,
    user: User
  ) {
    const permission = PermissionUtility(user);

    if (permission.user.id.length === 0) return { items: [], length: 0 };

    const andConditions: FindOptionsWhere<Product> = {};
    const orConditions: FindOptionsWhere<Product>[] = [];

    if (search) {
      orConditions.push(
        { code: ILike(`%${search}%`) },
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) }
      );
    }

    if (code) andConditions.code = code;
    if (name) andConditions.name = ILike(`%${name}%`);
    if (description) andConditions.description = ILike(`%${description}%`);
    if (packagingUnit) andConditions.packagingUnit = ILike(`%${packagingUnit}%`);
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

    if (warehouse) {
      const warehouseId = warehouse;
      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.productWarehouses', 'productWarehouse')
        .leftJoinAndSelect('productWarehouse.warehouse', 'warehouse')
        .innerJoin('product.productWarehouses', 'pw', 'pw.warehouse_id = :warehouseId', { warehouseId })
        .where('product.id = pw.product_id')
        .skip(limit * page)
        .take(limit)
        .orderBy('product.created_at', 'DESC');

      const result = await queryBuilder.getMany().catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

      const countQueryBuilder = this.productRepository
        .createQueryBuilder('product')
        .innerJoin('product.productWarehouses', 'pw', 'pw.warehouse_id = :warehouseId', { warehouseId })
        .where('product.id = pw.product_id');

      const length = await countQueryBuilder.getCount().catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

      return { items: result, length };
    }

    const init_search: FindManyOptions<Product> = {
      where,
      relations: ['productWarehouses', 'productWarehouses.warehouse'],
      skip: limit * page,
      take: limit,
      order: { created_at: 'DESC' },
    };

    if (
      !init_search.where ||
      (Array.isArray(init_search.where) && init_search.where.length === 0)
    )
      delete init_search.where;

    const result = await this.productRepository
      .find(init_search)
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const length = await this.productRepository.count({ where });

    return { items: result, length };
  }

  /**
   * FindByUserId
   * @description Get all products from all warehouses assigned to a user
   * @param  {string} userId
   */
  async findByUserId(userId: string) {
    const user = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!user || !user.warehouses || user.warehouses.length === 0) {
      return { items: [], length: 0 };
    }

    const warehouseIds = user.warehouses.map((warehouse) => warehouse.id);

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productWarehouses', 'productWarehouse')
      .leftJoinAndSelect('productWarehouse.warehouse', 'warehouse')
      .innerJoin('product.productWarehouses', 'pw', 'pw.warehouse_id IN (:...warehouseIds)', { warehouseIds })
      .where('product.id = pw.product_id')
      .orderBy('product.created_at', 'DESC');

    const result = await queryBuilder.getMany().catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const uniqueProducts = result.filter(
      (product, index, self) => index === self.findIndex((p) => p.id === product.id)
    );

    return { items: uniqueProducts, length: uniqueProducts.length };
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   * @param  {boolean} isRequired
   */
  async findOne(id: string, isRequired = true) {
    const result = await this.productRepository
      .findOne({
        where: { id: id },
        relations: ['productWarehouses', 'productWarehouses.warehouse'],
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
    const result = await this.productRepository
      .findOne({
        where: { code: code },
        relations: ['productWarehouses', 'productWarehouses.warehouse'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result && isRequired) throw Exception(exceptions.not_found, []);

    return result;
  }
}

