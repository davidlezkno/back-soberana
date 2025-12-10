// import swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-transformer
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// Create class dto
export class SelectWarehouseDto {
  // The number of items by page
  @ApiProperty({
    default: 20,
    type: Number,
    nullable: true,
    required: false,
    description: 'Max items by page',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  limit?: number;

  // The number of the page
  @ApiProperty({
    default: 0,
    type: Number,
    nullable: true,
    required: false,
    description: 'Current page',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  page?: number;

  // The word for search
  @ApiProperty({
    nullable: true,
    required: false,
    description: 'Any word',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'WH001',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Almacén Principal',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'City ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiProperty({
    description: 'active',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    type: String,
    example: '2024-10-26T15:30:00Z',
  })
  @IsOptional()
  @IsString()
  created_at?: string;
}

