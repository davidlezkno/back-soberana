import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { IWarehouseRepository } from '../interfaces/warehouse.repository.interface';

@Injectable()
export class WarehouseRepository extends Repository<Warehouse> implements IWarehouseRepository {
  constructor(protected dataSource: DataSource) {
    super(Warehouse, dataSource.createEntityManager());
  }
}

