import { Injectable, Inject } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  Raw,
} from 'typeorm';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { SelectByRolUserDto, SelectUserDto } from '../dto/select-user.dto';
import PermissionUtility from 'src/utils/permission.utility';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';
import { UserTypeEnum } from '../constants';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class UserSearchService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * FindAll
   * @description Get all records
   * @param  {SelectUserDto} query
   * @param  {User} user
   */
  async findAll(
    {
      document,
      name,
      surname,
      username,
      active,
      search,
      created_at,
      limit = 20,
      page = 0,
    }: SelectUserDto,
    user: User
  ) {
    const permission = PermissionUtility(user);

    if (permission.user.id.length === 0) return { items: [], length: 0 };

    const andConditions: FindOptionsWhere<User> = {};
    const orConditions: FindOptionsWhere<User>[] = [];

    if (search) {
      orConditions.push(
        { document: ILike(`%${search}%`) },
        { name: ILike(`%${search}%`) },
        { surname: ILike(`%${search}%`) },
        { username: ILike(`%${search}%`) }
      );
    }

    if (document) andConditions.document = document;
    if (name) andConditions.name = ILike(`%${name}%`);
    if (surname) andConditions.surname = ILike(`%${surname}%`);
    if (username) andConditions.username = ILike(`%${username}%`);
    if (active !== undefined) andConditions.active = active;

    if (created_at) {
      const [year, month] = created_at.split('T')[0].split('-');
      let day = created_at.split('T')[0].split('-')[2];
      const [hour] = created_at.split('T')[1].replace('Z', '').split(':');

      if (parseInt(hour, 10) + 5 >= 24) {
        day = String(parseInt(day, 10) + 1).padStart(2, '0');
      }

      const adjustedStart = `${year}-${month}-${day} 00:00:00`;
      const adjustedEnd = `${year}-${month}-${day} 23:59:59`;

      andConditions.created_at = Raw(
        (alias) =>
          `DATE(${alias} - INTERVAL '5 hours') BETWEEN '${adjustedStart}'::TIMESTAMP 
            AND '${adjustedEnd}'::TIMESTAMP`
      );
    }

    const where =
      orConditions.length > 0
        ? { ...andConditions, OR: orConditions }
        : andConditions;

    const init_search: FindManyOptions<User> = {
      where,
      relations: ['warehouses'],
      skip: limit * page,
      take: limit,
      order: { created_at: 'DESC' },
    };

    if (
      !init_search.where ||
      (Array.isArray(init_search.where) && init_search.where.length === 0)
    )
      delete init_search.where;

    const result = await this.userRepository
      .find(init_search)
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const length = await this.userRepository.count({ where });

    return { items: result, length };
  }

  /**
   * FindAllByRol
   * @description Get all records by role
   * @param  {SelectByRolUserDto} query
   * @param  {User} user
   */
  async findAllByRol(
    { rol = UserTypeEnum.User, search, limit, page }: SelectByRolUserDto,
    user: User
  ) {
    const permission = PermissionUtility(user);

    if (permission.user.id.length === 0) return { items: [], length: 0 };

    const _and: any = { active: true };
    const where: FindOptionsWhere<User>[] = [];

    if (rol && rol !== 'all') where.push({ type: rol });

    if (search) {
      where.push({ document: ILike(`%${search}%`) });
      where.push({ name: ILike(`%${search}%`) });
      where.push({ surname: ILike(`%${search}%`) });
      where.push({ username: ILike(`%${search}%`) });
    }

    where.forEach((element, index) => {
      where[index] = { ..._and, ...element };
    });

    if (where.length === 0 && Object.entries(_and).length > 0) where.push(_and);

    const init_search: FindManyOptions<User> = {
      where,
      relations: ['warehouses'],
      order: { created_at: 'DESC' },
    };

    if (limit !== undefined && page !== undefined) {
      init_search.skip = limit * page;
      init_search.take = limit;
    }

    if (
      !init_search.where ||
      (Array.isArray(init_search.where) && init_search.where.length === 0)
    )
      delete init_search.where;

    const result = await this.userRepository
      .find(init_search)
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    const length = await this.userRepository.count({ where });

    return { items: result, length };
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   * @param  {boolean} isRequired
   */
  async findOne(id: string, isRequired = true) {
    const result = await this.userRepository
      .findOne({
        where: { id: id },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result && isRequired) throw Exception(exceptions.not_found, []);

    return result;
  }

  /**
   * FindOneByEmail
   * @description Get one record by email
   * @param  {string} email
   * @param  {boolean} isRequired
   */
  async findOneByEmail(email: string, isRequired = true) {
    const result = await this.userRepository
      .findOne({
        where: { username: email },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result && isRequired) throw Exception(exceptions.not_found, []);

    return result;
  }

  /**
   * FindOneBy
   * @description Get one record by where condition
   * @param  {FindOptionsWhere<User>} where
   */
  async findOneBy(where: FindOptionsWhere<User>) {
    const result = await this.userRepository
      .findOne({
        where,
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result) throw Exception(exceptions.not_found, []);

    return result;
  }

  /**
   * Profile
   * @description Get user profile
   * @param  {User} user
   */
  async profile(user: User) {
    const result = await this.userRepository
      .find({
        where: {
          id: user.id,
          active: true,
        },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!result) throw Exception(exceptions.not_found, []);

    return result;
  }
}

