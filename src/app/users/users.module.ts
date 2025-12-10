import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { UsersService } from './users.service';
import { UserSearchService } from './services/user-search.service';
import { UserPasswordService } from './services/user-password.service';
import { UserWarehouseService } from './services/user-warehouse.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { WarehouseRepository } from '../warehouse/repositories/warehouse.repository';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IWarehouseRepository } from '../warehouse/interfaces/warehouse.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User, Warehouse]), ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSearchService,
    UserPasswordService,
    UserWarehouseService,
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: REPOSITORY_TOKENS.WAREHOUSE_REPOSITORY,
      useClass: WarehouseRepository,
    },
    UserRepository,
    WarehouseRepository,
  ],
  exports: [UsersService, REPOSITORY_TOKENS.USER_REPOSITORY],
})
export class UsersModule {}

