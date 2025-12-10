import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  constructor(protected dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}

