import { Injectable, Inject } from '@nestjs/common';
import { IWarehouseRepository } from '../interfaces/warehouse.repository.interface';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class WarehouseUserService {
  constructor(
    @Inject(REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository
  ) {}

  /**
   * FindByUser
   * @description Get all warehouses by user id
   * @param  {string} userId
   */
  async findByUser(userId: string) {
    const queryBuilder = this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.city', 'city')
      .leftJoinAndSelect('warehouse.users', 'users')
      .innerJoin('warehouse.users', 'user', 'user.id = :userId', { userId })
      .where('warehouse.active = :active', { active: true })
      .orderBy('warehouse.created_at', 'DESC');

    const result = await queryBuilder.getMany().catch((error) => {
      throw Exception(exceptions.error_find, [], error);
    });

    const length = await queryBuilder.getCount().catch((error) => {
      throw Exception(exceptions.error_find, [], error);
    });

    return { items: result, length };
  }
}

