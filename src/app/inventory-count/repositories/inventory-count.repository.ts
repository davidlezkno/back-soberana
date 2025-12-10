import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InventoryCount } from '../entities/inventory-count.entity';
import { IInventoryCountRepository } from '../interfaces/inventory-count.repository.interface';

@Injectable()
export class InventoryCountRepository extends Repository<InventoryCount> implements IInventoryCountRepository {
  constructor(protected dataSource: DataSource) {
    super(InventoryCount, dataSource.createEntityManager());
  }
}

