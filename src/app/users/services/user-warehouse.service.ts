import { Injectable, Inject } from '@nestjs/common';
import { In } from 'typeorm';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { IWarehouseRepository } from '../../warehouse/interfaces/warehouse.repository.interface';
import { User } from '../entities/user.entity';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class UserWarehouseService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository
  ) {}

  /**
   * AssignWarehouses
   * @description Assign warehouses to a user
   * @param  {string} userId
   * @param  {string[]} warehouseIds
   */
  async assignWarehouses(userId: string, warehouseIds: string[]) {
    if (!warehouseIds || warehouseIds.length === 0) {
      return;
    }

    const warehouses = await this.warehouseRepository
      .findBy({ id: In(warehouseIds) })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const user = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!user) throw Exception(exceptions.not_found, []);

    user.warehouses = warehouses;
    await this.userRepository.save(user);
  }

  /**
   * UpdateWarehouses
   * @description Update warehouses assigned to a user
   * @param  {string} userId
   * @param  {string[]} warehouseIds
   */
  async updateWarehouses(userId: string, warehouseIds: string[]) {
    const user = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!user) throw Exception(exceptions.not_found, []);

    if (warehouseIds.length > 0) {
      const warehouses = await this.warehouseRepository
        .findBy({ id: In(warehouseIds) })
        .catch((error) => {
          throw Exception(exceptions.error_find, [], error);
        });

      user.warehouses = warehouses;
      await this.userRepository.save(user);
    } else {
      user.warehouses = [];
      await this.userRepository.save(user);
    }
  }

  /**
   * LoadUserWithWarehouses
   * @description Load user with warehouses relation
   * @param  {string} userId
   */
  async loadUserWithWarehouses(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['warehouses'],
    });
  }
}

