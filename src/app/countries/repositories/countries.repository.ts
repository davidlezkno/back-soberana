import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Countries } from '../entities/countries.entity';
import { ICountriesRepository } from '../interfaces/countries.repository.interface';

@Injectable()
export class CountriesRepository extends Repository<Countries> implements ICountriesRepository {
  constructor(protected dataSource: DataSource) {
    super(Countries, dataSource.createEntityManager());
  }
}

