import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './repositories/departments.repository';
import { Departments } from './entities/departments.entity';
import { IDepartmentsRepository } from './interfaces/departments.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Departments])],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    {
      provide: REPOSITORY_TOKENS.DEPARTMENTS_REPOSITORY,
      useClass: DepartmentsRepository,
    },
    DepartmentsRepository,
  ],
  exports: [DepartmentsService, REPOSITORY_TOKENS.DEPARTMENTS_REPOSITORY],
})
export class DepartmentsModule {}

