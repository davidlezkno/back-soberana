import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLine } from './entities/inventory-line.entity';
import { InventoryLineService } from './inventory-line.service';
import { InventoryLineController } from './inventory-line.controller';
import { InventoryLineRepository } from './repositories/inventory-line.repository';
import { IInventoryLineRepository } from './interfaces/inventory-line.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLine])],
  controllers: [InventoryLineController],
  providers: [
    InventoryLineService,
    {
      provide: REPOSITORY_TOKENS.INVENTORY_LINE_REPOSITORY,
      useClass: InventoryLineRepository,
    },
    InventoryLineRepository,
  ],
  exports: [InventoryLineService, REPOSITORY_TOKENS.INVENTORY_LINE_REPOSITORY],
})
export class InventoryLineModule {}

