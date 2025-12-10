import { Injectable, Inject } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { IUserRepository } from './interfaces/user.repository.interface';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SelectByRolUserDto, SelectUserDto } from './dto/select-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Exception } from '../../utils/exception.utility';
import { UserTypeEnum, exceptions } from './constants';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';
import { UserSearchService } from './services/user-search.service';
import { UserPasswordService } from './services/user-password.service';
import { UserWarehouseService } from './services/user-warehouse.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userSearchService: UserSearchService,
    private readonly userPasswordService: UserPasswordService,
    private readonly userWarehouseService: UserWarehouseService
  ) {}

  /**
   * Create
   * @description Create a new record
   * @param  {CreateUserDto} createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    // Validate password match
    this.userPasswordService.validatePasswordMatch(
      createUserDto.password,
      createUserDto.password_retry
    );

    // Hash password
    const password_hash = await this.userPasswordService.hashPassword(createUserDto.password);

    // Save record
    const result = await this.userRepository
      .save({
        password: password_hash,
        name: createUserDto.name.trim(),
        document: createUserDto.document.trim(),
        surname: createUserDto.surname.trim(),
        username: createUserDto.username.toLowerCase().trim(),
        type: Object.values(UserTypeEnum).find((v) => v === createUserDto.type)
          ? createUserDto.type
          : UserTypeEnum.User,
      })
      .catch((error) => {
        if (error.code === '23505')
          throw Exception(
            error.detail.includes('username')
              ? exceptions.duplicated
              : exceptions.duplicatedCode
          );

        throw Exception(exceptions.error_save, [], error);
      });

    // Ensure result is a single User (not an array)
    const savedUser = Array.isArray(result) ? result[0] : result;

    // Assign warehouses if provided
    if (createUserDto.warehouses && createUserDto.warehouses.length > 0) {
      await this.userWarehouseService.assignWarehouses(savedUser.id, createUserDto.warehouses);
    }

    // Load warehouses relation
    const userWithWarehouses = await this.userWarehouseService.loadUserWithWarehouses(savedUser.id);

    // Return result with warehouses
    return {
      ...savedUser,
      warehouses: userWithWarehouses?.warehouses || [],
    };
  }

  /**
   * FindAll
   * @description Get all records
   * @param  {SelectUserDto} query
   * @param  {User} user
   */
  async findAll(query: SelectUserDto, user: User) {
    return this.userSearchService.findAll(query, user);
  }

  /**
   * FindAllByRol
   * @description Get all records by role
   * @param  {SelectByRolUserDto} query
   * @param  {User} user
   */
  async findAllByRol(query: SelectByRolUserDto, user: User) {
    return this.userSearchService.findAllByRol(query, user);
  }

  /**
   * FindOne
   * @description Get one record
   * @param  {string} id
   * @param  {boolean} isRequired
   */
  async findOne(id: string, isRequired = true) {
    return this.userSearchService.findOne(id, isRequired);
  }

  /**
   * FindOneByEmail
   * @description Get one record by email
   * @param  {string} email
   * @param  {boolean} isRequired
   */
  async findOneByEmail(email: string, isRequired = true) {
    return this.userSearchService.findOneByEmail(email, isRequired);
  }

  /**
   * ValidatePassword
   * @description Validate password for a user
   * @param  {string} email
   * @param  {string} password
   */
  async validatePassword(email: string, password: string) {
    const user = await this.userRepository
      .findOneBy({ username: email })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!user) throw Exception(exceptions.not_found, []);

    const valid = await this.userPasswordService.validatePassword(password, user.password);
    if (!valid) throw Exception(exceptions.error_password);

    return true;
  }

  /**
   * FindOneBy
   * @description Get one record by where condition
   * @param  {FindOptionsWhere<User>} where
   */
  async findOneBy(where: FindOptionsWhere<User>) {
    return this.userSearchService.findOneBy(where);
  }

  /**
   * Profile
   * @description Get user profile
   * @param  {User} user
   */
  async profile(user: User) {
    return this.userSearchService.profile(user);
  }

  /**
   * Update
   * @description Update one record
   * @param  {string} id
   * @param  {UpdateUserDto} updateUserDto
   * @param  {boolean} password
   */
  async update(id: string, updateUserDto: UpdateUserDto, password?: boolean) {
    const find = await this.userRepository
      .findOneBy({ id: id })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const data: DeepPartial<User> = { ...find };

    if (!password) {
      if (updateUserDto.name) data.name = updateUserDto.name;
      if (updateUserDto.type) data.type = updateUserDto.type;
      if (updateUserDto.document) data.document = updateUserDto.document;
      if (updateUserDto.surname) data.surname = updateUserDto.surname;
      if (updateUserDto.username)
        data.username = updateUserDto.username.toLowerCase().trim();
    }
    data.password_change = updateUserDto.password_change;

    // Handle password update
    if (Boolean(updateUserDto.password)) {
      this.userPasswordService.validatePasswordMatch(
        updateUserDto.password,
        updateUserDto.password_retry
      );

      data.password = await this.userPasswordService.hashPassword(updateUserDto.password);
      data.last_password_change = new Date();
    }

    // Save record
    const result = await this.userRepository.save(data).catch((error) => {
      if (error.code === '23505')
        throw Exception(
          error.detail.includes('username')
            ? exceptions.duplicated
            : exceptions.duplicatedCode
        );

      throw Exception(exceptions.error_update, [], error);
    });

    // Ensure result is a single User (not an array)
    const savedUser = Array.isArray(result) ? result[0] : result;

    // Update warehouses if provided
    if (updateUserDto.warehouses !== undefined) {
      await this.userWarehouseService.updateWarehouses(savedUser.id, updateUserDto.warehouses);
    }

    // Load warehouses relation
    const userWithWarehouses = await this.userWarehouseService.loadUserWithWarehouses(savedUser.id);

    // Return result with warehouses
    return {
      ...savedUser,
      warehouses: userWithWarehouses?.warehouses || [],
    };
  }

  /**
   * Remove
   * @description Remove one record
   * @param  {string} id
   */
  async remove(id: string) {
    const find = await this.userRepository
      .findOne({
        where: { id: id },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const result = await this.userRepository
      .save({ ...find, active: false })
      .catch((error) => {
        throw Exception(exceptions.error_delete, [], error);
      });

    return {
      ...result,
      warehouses: find.warehouses || [],
    };
  }

  /**
   * Reactivate
   * @description Reactivate one record
   * @param  {string} id
   */
  async reactivate(id: string) {
    const find = await this.userRepository
      .findOne({
        where: { id: id },
        relations: ['warehouses'],
      })
      .catch((error) => {
        throw Exception(exceptions.error_find, [], error);
      });

    if (!find) throw Exception(exceptions.not_found, []);

    const result = await this.userRepository
      .save({ ...find, active: true })
      .catch((error) => {
        throw Exception(exceptions.error_delete, [], error);
      });

    return {
      ...result,
      warehouses: find.warehouses || [],
    };
  }
}

