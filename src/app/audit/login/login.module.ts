import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoginAudit } from './entities/login.entity';
import { LoginAuditService } from './login.service';
import { LoginAuditRepository } from './repositories/login.repository';
import { ILoginAuditRepository } from './interfaces/login.repository.interface';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([LoginAudit]), ConfigModule],
  providers: [
    LoginAuditService,
    {
      provide: REPOSITORY_TOKENS.LOGIN_AUDIT_REPOSITORY,
      useClass: LoginAuditRepository,
    },
    LoginAuditRepository,
  ],
  exports: [LoginAuditService],
})
export class LoginAuditModule {}

