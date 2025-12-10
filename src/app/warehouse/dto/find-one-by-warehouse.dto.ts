// Import swagger
import { ApiProperty } from '@nestjs/swagger';

// Import validators
import { IsOptional, IsString, IsBoolean, IsUUID, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FindOneByWarehouseDto {
  @ApiProperty({
    description: 'Warehouse ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ApiProperty({
    description: 'Warehouse code',
    example: 'WH001',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Warehouse name',
    example: 'Bodega Principal',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Warehouse active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'City ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  city?: string;

  @ApiProperty({
    description: 'Max items by page',
    default: 20,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: 'Current page',
    default: 0,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;
}

