import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from './entities/cities.entity';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { CitiesRepository } from './repositories/cities.repository';
import { ICitiesRepository } from './interfaces/cities.repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/repository-tokens.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Cities])],
  controllers: [CitiesController],
  providers: [
    CitiesService,
    {
      provide: REPOSITORY_TOKENS.CITIES_REPOSITORY,
      useClass: CitiesRepository,
    },
    CitiesRepository,
  ],
  exports: [CitiesService, REPOSITORY_TOKENS.CITIES_REPOSITORY],
})
export class CitiesModule {}

