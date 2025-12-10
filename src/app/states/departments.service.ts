import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { DepartmentsRepository } from './repositories/departments.repository';
import { IDepartmentsRepository } from './interfaces/departments.repository.interface';
import { Departments } from './entities/departments.entity';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Injectable()
export class DepartmentsService {
  constructor(
    @Inject(REPOSITORY_TOKENS.DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository
  ) {}
  

  /**
   * GetAll
   * @description Get all active records
   */
  async getAll() {
    // Initialize search
    const init_search: FindManyOptions<Departments> = {
      where: {
        isActive: true,
      },
      order: { name: 'ASC' },
    };

    // Get all records
    const result = await this.departmentsRepository.find(init_search);

    // Return result
    return result;
  }

  /**
   * FindById
   * @description Get one record by id
   * @param  {string} id
   */
  async findById(id: string) {
    // Find record
    const result = await this.departmentsRepository.findOne({
      where: {
        id: id,
        isActive: true,
      },
    });

    // Return result
    return result;
  }

  /**
   * FindByCountry
   * @description Get all records by country id
   * @param  {string} countryId
   */
  async findByCountry(countryId: string) {
    // Initialize search
    const init_search: FindManyOptions<Departments> = {
      where: {
        country: {
          id: countryId,
        },
        isActive: true,
      } as FindOptionsWhere<Departments>,
      order: { name: 'ASC' },
    };

    // Get all records
    const result = await this.departmentsRepository.find(init_search);

    // Return result
    return result;
  }
}

