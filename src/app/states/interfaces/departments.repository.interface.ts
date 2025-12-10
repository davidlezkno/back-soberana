import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Departments } from '../entities/departments.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * IDepartmentsRepository
 * @description Interface for Departments repository
 */
export interface IDepartmentsRepository extends IBaseRepository<Departments> {
  findOneBy(where: FindOptionsWhere<Departments>): Promise<Departments | null>;
}

