import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { User } from '../entities/user.entity';
import { FindManyOptions, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';

/**
 * IUserRepository
 * @description Interface for User repository
 */
export interface IUserRepository extends IBaseRepository<User> {
  findOneBy(where: FindOptionsWhere<User>): Promise<User | null>;
  findBy(where: FindOptionsWhere<User>): Promise<User[]>;
  createQueryBuilder(alias?: string): SelectQueryBuilder<User>;
}

