import { DeepPartial, FindManyOptions, FindOptionsWhere, DeleteResult, UpdateResult } from 'typeorm';

/**
 * IBaseRepository
 * @description Base interface for all repositories
 * @template T Entity type
 */
export interface IBaseRepository<T> {
  findOne(options: FindManyOptions<T> | FindOptionsWhere<T>): Promise<T | null>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  save(entity: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]>;
  remove(entity: T | T[]): Promise<T | T[]>;
  delete(criteria: string | string[] | FindOptionsWhere<T>): Promise<DeleteResult>;
  update(criteria: FindOptionsWhere<T>, partialEntity: DeepPartial<T>): Promise<UpdateResult>;
  count(options?: FindManyOptions<T>): Promise<number>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
}

