import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Cities } from '../entities/cities.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * ICitiesRepository
 * @description Interface for Cities repository
 */
export interface ICitiesRepository extends IBaseRepository<Cities> {
  findOneBy(where: FindOptionsWhere<Cities>): Promise<Cities | null>;
}

