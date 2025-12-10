import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { CountriesRepository } from './repositories/countries.repository';
import { ICountriesRepository } from './interfaces/countries.repository.interface';
import { Countries } from './entities/countries.entity';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(REPOSITORY_TOKENS.COUNTRIES_REPOSITORY)
    private readonly countriesRepository: ICountriesRepository
  ) {}

  /**
   * GetAll
   * @description Get all active records
   */
  async getAll() {
    // Initialize search
    const init_search: FindManyOptions<Countries> = {
      where: {
        isActive: true,
      },
      order: { name: 'ASC' },
    };

    // Get all records
    const result = await this.countriesRepository.find(init_search);

    // Return result
    return result;
  }
}

