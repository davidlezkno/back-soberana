import { Injectable, Inject } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { IProductRepository } from './interfaces/product.repository.interface';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { SelectProductDto } from './dto/select-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Exception } from '../../utils/exception.utility';
import { exceptions } from './constants';
import { User } from '../users/entities/user.entity';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';
import { ProductSearchService } from './services/product-search.service';
import { ProductWarehouseService } from './services/product-warehouse.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly productSearchService: ProductSearchService,
    private readonly productWarehouseService: ProductWarehouseService
  ) {}

  /**
   * Create
   * @description Create a new record
   * @param  {CreateProductDto} createProductDto
   * @param  {User} user
   */
  async create(createProductDto: CreateProductDto, user: User) {
    const data: DeepPartial<Product> = {
      code: createProductDto.code.trim(),
      name: createProductDto.name.trim(),
      description: createProductDto.description.trim(),
      packagingUnit: createProductDto.packagingUnit.trim(),
      conversionFactor: createProductDto.conversionFactor,
      price: createProductDto.price,
      createdBy: user,
    };

    const result = await this.productRepository.save(data)
      .catch((error) => {
        if (error.code === '23505')
          throw Exception(
            error.detail.includes('code')
              ? exceptions.duplicated
              : exceptions.duplicatedCode
          );

        throw Exception(exceptions.error_save, [], error);
      });

    // Ensure result is a single Product (not an array)
    const savedProduct = Array.isArray(result) ? result[0] : result;

    // Delegate warehouse quantities management to ProductWarehouseService
    if (createProductDto.quantities && createProductDto.quantities.length > 0) {
      await this.productWarehouseService.createQuantities(
        savedProduct.id,
        createProductDto.quantities
      );
    }

    return savedProduct;
  }

  /**
   * FindAll
   * @description Get all records
   * @param  {SelectProductDto} query
   * @param  {User} user
   */
  async findAll(query: SelectProductDto, user: User) {
    return this.productSearchService.findAll(query, user);
  }

  /**
   * FindByUserId
   * @description Get all products from all warehouses assigned to a user
   * @param  {string} userId
   */
  async findByUserId(userId: string) {
    return this.productSearchService.findByUserId(userId);
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   * @param  {boolean} isRequired
   */
  async findOne(id: string, isRequired = true) {
    return this.productSearchService.findOne(id, isRequired);
  }

  /**
   * FindOneByCode
   * @description Get one record by code
   * @param  {string} code
   * @param  {boolean} isRequired
   */
  async findOneByCode(code: string, isRequired = true) {
    return this.productSearchService.findOneByCode(code, isRequired);
  }

  /**
   * Update
   * @description Update one record
   * @param  {string} id
   * @param  {UpdateProductDto} updateProductDto
   * @param  {User} user
   */
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const find = await this.productRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const data: DeepPartial<Product> = {
      id: find.id,
    };

    if (updateProductDto.code) data.code = updateProductDto.code.trim();
    if (updateProductDto.name) data.name = updateProductDto.name.trim();
    if (updateProductDto.description) data.description = updateProductDto.description.trim();
    if (updateProductDto.packagingUnit) data.packagingUnit = updateProductDto.packagingUnit.trim();
    if (updateProductDto.conversionFactor !== undefined) data.conversionFactor = updateProductDto.conversionFactor;
    if (updateProductDto.price !== undefined) data.price = updateProductDto.price;
    data.updatedBy = user;

    const result = await this.productRepository.save(data).catch((error) => {
      if (error.code === '23505')
        throw Exception(
          error.detail.includes('code')
            ? exceptions.duplicated
            : exceptions.duplicatedCode
        );

      throw Exception(exceptions.error_update, [], error);
      });

    // Ensure result is a single Product (not an array)
    const savedProduct = Array.isArray(result) ? result[0] : result;

    // Delegate warehouse quantities management to ProductWarehouseService
    if (updateProductDto.quantities !== undefined) {
      await this.productWarehouseService.updateQuantities(
        savedProduct.id,
        updateProductDto.quantities
      );
    }
    
    const updated = await this.productRepository
      .findOne({
        where: { id: savedProduct.id },
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    return updated || savedProduct;
  }

  /**
   * Remove
   * @description Remove one record
   * @param  {string} id
   */
  async remove(id: string) {
    const find = await this.productRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const result = await this.productRepository
      .save({ ...find, active: false })
      .catch((error) => {
        throw Exception(exceptions.error_delete, [], error);
      });

    // Return result
    return result;
  }

  /**
   * Reactivate
   * @description Reactivate one record
   * @param  {string} id
   */
  async reactivate(id: string) {
    const find = await this.productRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const result = await this.productRepository
      .save({ ...find, active: true })
      .catch((error) => {
        throw Exception(exceptions.error_delete, [], error);
      });

    return result;
  }
}

