import { Module } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { WarehouseModule } from './app/warehouse/warehouse.module';
import { CountriesModule } from './app/countries/countries.module';
import { DepartmentsModule } from './app/states/departments.module';
import { CitiesModule } from './app/cities/cities.module';
import { ProductModule } from './app/product/product.module';
import { InventoryCountModule } from './app/inventory-count/inventory-count.module';
import { InventoryLineModule } from './app/inventory-line/inventory-line.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        schema: Boolean(configService.get('DB_SCHEMA')?.trim())
          ? configService.get('DB_SCHEMA').trim()
          : 'public',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migration/*{.ts,.js}'],
        migrationsRun: process.env.NODE_ENV === 'production',
        synchronize: process.env.NODE_ENV !== 'production', 
        timezone: configService.get('TZ'), 
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    WarehouseModule,
    CountriesModule,
    DepartmentsModule,
    CitiesModule,
    ProductModule,
    InventoryCountModule,
    InventoryLineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

