import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Countries } from '../entities/countries.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * ICountriesRepository
 * @description Interface for Countries repository
 */
export interface ICountriesRepository extends IBaseRepository<Countries> {
  findOneBy(where: FindOptionsWhere<Countries>): Promise<Countries | null>;
}

