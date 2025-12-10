import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from './entities/countries.entity';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { CountriesRepository } from './repositories/countries.repository';
import { ICountriesRepository } from './interfaces/countries.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  controllers: [CountriesController],
  providers: [
    CountriesService,
    {
      provide: REPOSITORY_TOKENS.COUNTRIES_REPOSITORY,
      useClass: CountriesRepository,
    },
    CountriesRepository,
  ],
  exports: [CountriesService, REPOSITORY_TOKENS.COUNTRIES_REPOSITORY],
})
export class CountriesModule {}

