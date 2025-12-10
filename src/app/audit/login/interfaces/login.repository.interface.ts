import { IBaseRepository } from '../../../../common/interfaces/base-repository.interface';
import { LoginAudit } from '../entities/login.entity';
import { FindOptionsWhere } from 'typeorm';

/**
 * ILoginAuditRepository
 * @description Interface for LoginAudit repository
 */
export interface ILoginAuditRepository extends IBaseRepository<LoginAudit> {
  findOneBy(where: FindOptionsWhere<LoginAudit>): Promise<LoginAudit | null>;
}

