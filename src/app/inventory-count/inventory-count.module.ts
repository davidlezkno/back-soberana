import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryCount } from './entities/inventory-count.entity';
import { InventoryCountService } from './inventory-count.service';
import { InventoryCountController } from './inventory-count.controller';
import { InventoryCountRepository } from './repositories/inventory-count.repository';
import { IInventoryCountRepository } from './interfaces/inventory-count.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryCount])],
  controllers: [InventoryCountController],
  providers: [
    InventoryCountService,
    {
      provide: REPOSITORY_TOKENS.INVENTORY_COUNT_REPOSITORY,
      useClass: InventoryCountRepository,
    },
    InventoryCountRepository,
  ],
  exports: [InventoryCountService, REPOSITORY_TOKENS.INVENTORY_COUNT_REPOSITORY],
})
export class InventoryCountModule {}

