import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseSearchService } from './services/warehouse-search.service';
import { WarehouseUserService } from './services/warehouse-user.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { IWarehouseRepository } from './interfaces/warehouse.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    WarehouseSearchService,
    WarehouseUserService,
    {
      provide: REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY,
      useClass: WarehouseRepository,
    },
    WarehouseRepository,
  ],
  exports: [WarehouseService, REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY],
})
export class WarehouseModule {}

