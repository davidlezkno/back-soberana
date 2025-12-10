import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InventoryLine } from '../entities/inventory-line.entity';
import { IInventoryLineRepository } from '../interfaces/inventory-line.repository.interface';

@Injectable()
export class InventoryLineRepository extends Repository<InventoryLine> implements IInventoryLineRepository {
  constructor(protected dataSource: DataSource) {
    super(InventoryLine, dataSource.createEntityManager());
  }
}

