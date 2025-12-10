import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { CitiesRepository } from './repositories/cities.repository';
import { ICitiesRepository } from './interfaces/cities.repository.interface';
import { Cities } from './entities/cities.entity';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Injectable()
export class CitiesService {
  constructor(
    @Inject(REPOSITORY_TOKENS.CITIES_REPOSITORY)
    private readonly citiesRepository: ICitiesRepository
  ) {}

  /**
   * GetAll
   * @description Get all active records
   */
  async getAll() {
    // Initialize search
    const init_search: FindManyOptions<Cities> = {
      where: {
        isActive: true,
      },
      order: { name: 'ASC' },
    };

    // Get all records
    const result = await this.citiesRepository.find(init_search);

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
    const result = await this.citiesRepository.findOne({
      where: {
        id: id,
        isActive: true,
      },
    });

    // Return result
    return result;
  }

  /**
   * FindByDepto
   * @description Get all records by department id
   * @param  {string} departmentId
   */
  async findByDepto(departmentId: string) {
    // Initialize search
    const init_search: FindManyOptions<Cities> = {
      where: {
        department: {
          id: departmentId,
        },
        isActive: true,
      } as FindOptionsWhere<Cities>,
      order: { name: 'ASC' },
    };

    // Get all records
    const result = await this.citiesRepository.find(init_search);

    // Return result
    return result;
  }
}

