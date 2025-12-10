import { Injectable, Inject } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { IProductWarehouseRepository } from '../interfaces/product-warehouse.repository.interface';
import { ProductWarehouse } from '../entities/product-warehouse.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { QuantityItemDto } from '../dto/create-product.dto';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class ProductWarehouseService {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT_WAREHOUSE_REPOSITORY)
    private readonly productWarehouseRepository: IProductWarehouseRepository
  ) {}

  /**
   * CreateQuantities
   * @description Create product-warehouse relationships
   * @param  {string} productId
   * @param  {QuantityItemDto[]} quantities
   */
  async createQuantities(productId: string, quantities: QuantityItemDto[]) {
    if (!quantities || quantities.length === 0) {
      return;
    }

    const productWarehouseData: DeepPartial<ProductWarehouse>[] = quantities.map(
      (item) => ({
        product: { id: productId } as Product,
        warehouse: { id: item.warehouse_id } as Warehouse,
        quantity: item.quantity,
      })
    );

    await this.productWarehouseRepository
      .save(productWarehouseData)
      .catch((error) => {
        throw Exception(exceptions.error_save, [], error);
      });
  }

  /**
   * UpdateQuantities
   * @description Update product-warehouse relationships
   * @param  {string} productId
   * @param  {QuantityItemDto[]} quantities
   */
  async updateQuantities(productId: string, quantities: QuantityItemDto[]) {
    const existingProductWarehouses = await this.productWarehouseRepository
      .find({
        where: { product: { id: productId } as Product },
        relations: ['warehouse'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (quantities.length > 0) {
      for (const item of quantities) {
        const existing = existingProductWarehouses.find(
          (pw) => pw.warehouse.id === item.warehouse_id
        );

        if (existing) {
          existing.quantity = item.quantity;
          await this.productWarehouseRepository.save(existing).catch((error) => {
            throw Exception(exceptions.error_update, [], error);
          });
        } else {
          const newProductWarehouse: DeepPartial<ProductWarehouse> = {
            product: { id: productId } as Product,
            warehouse: { id: item.warehouse_id } as Warehouse,
            quantity: item.quantity,
          };
          await this.productWarehouseRepository.save(newProductWarehouse).catch((error) => {
            throw Exception(exceptions.error_save, [], error);
          });
        }
      }

      const warehouseIdsInQuantities = quantities.map(
        (item) => item.warehouse_id
      );

      const recordsToDelete = existingProductWarehouses.filter(
        (pw) => !warehouseIdsInQuantities.includes(pw.warehouse.id)
      );

      if (recordsToDelete.length > 0) {
        await this.productWarehouseRepository
          .remove(recordsToDelete)
          .catch((error) => {
            throw Exception(exceptions.error_delete, [], error);
          });
      }
    } else {
      if (existingProductWarehouses.length > 0) {
        await this.productWarehouseRepository
          .remove(existingProductWarehouses)
          .catch((error) => {
            throw Exception(exceptions.error_delete, [], error);
          });
      }
    }
  }
}

