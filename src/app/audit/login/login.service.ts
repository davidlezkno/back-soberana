import { Injectable, Inject } from '@nestjs/common';
import { LoginAuditRepository } from './repositories/login.repository';
import { ILoginAuditRepository } from './interfaces/login.repository.interface';
import { CreateLoginAuditDto } from './dto/create-login.dto';
import { exceptions } from './constants';
import { Exception } from '../../../utils/exception.utility';
import { REPOSITORY_TOKENS } from '../../../common/constants/repository-tokens.constants';

@Injectable()
export class LoginAuditService {
  constructor(
    @Inject(REPOSITORY_TOKENS.LOGIN_AUDIT_REPOSITORY)
    private readonly loginAuditsRepository: ILoginAuditRepository
  ) {}

  /**
   * Create
   * @description Create a new record
   * @param  {CreateLoginAuditDto} createLoginAuditsDto
   */
  async create(createLoginAuditsDto: CreateLoginAuditDto) {
    // Save record
    const result = await this.loginAuditsRepository
      .save({
        username: createLoginAuditsDto.username.trim(),
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_save, [], error);
      });

    // Return result
    return result;
  }
}

