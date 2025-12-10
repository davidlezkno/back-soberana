import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cities } from '../entities/cities.entity';
import { ICitiesRepository } from '../interfaces/cities.repository.interface';

@Injectable()
export class CitiesRepository extends Repository<Cities> implements ICitiesRepository {
  constructor(protected dataSource: DataSource) {
    super(Cities, dataSource.createEntityManager());
  }
}

