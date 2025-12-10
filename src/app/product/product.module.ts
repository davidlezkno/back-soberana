import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductWarehouse } from './entities/product-warehouse.entity';
import { User } from '../users/entities/user.entity';
import { ProductService } from './product.service';
import { ProductSearchService } from './services/product-search.service';
import { ProductWarehouseService } from './services/product-warehouse.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductWarehouseRepository } from './repositories/product-warehouse.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { IProductRepository } from './interfaces/product.repository.interface';
import { IProductWarehouseRepository } from './interfaces/product-warehouse.repository.interface';
import { IUserRepository } from '../users/interfaces/user.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductWarehouse, User])],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductSearchService,
    ProductWarehouseService,
    {
      provide: REPOSITORY_TOKENS.PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    {
      provide: REPOSITORY_TOKENS.PRODUCT_WAREHOUSE_REPOSITORY,
      useClass: ProductWarehouseRepository,
    },
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: UserRepository,
    },
    ProductRepository,
    ProductWarehouseRepository,
    UserRepository,
  ],
  exports: [ProductService, REPOSITORY_TOKENS.PRODUCT_REPOSITORY],
})
export class ProductModule {}

