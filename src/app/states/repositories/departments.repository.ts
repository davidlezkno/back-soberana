import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Departments } from '../entities/departments.entity';
import { IDepartmentsRepository } from '../interfaces/departments.repository.interface';

@Injectable()
export class DepartmentsRepository extends Repository<Departments> implements IDepartmentsRepository {
  constructor(protected dataSource: DataSource) {
    super(Departments, dataSource.createEntityManager());
  }
}

