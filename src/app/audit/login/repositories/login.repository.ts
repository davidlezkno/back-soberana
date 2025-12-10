import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LoginAudit } from '../entities/login.entity';
import { ILoginAuditRepository } from '../interfaces/login.repository.interface';

@Injectable()
export class LoginAuditRepository extends Repository<LoginAudit> implements ILoginAuditRepository {
  constructor(protected dataSource: DataSource) {
    super(LoginAudit, dataSource.createEntityManager());
  }
}

