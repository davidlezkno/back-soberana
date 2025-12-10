// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import
import { IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

// Create class dto
export class UpdateWarehouseDto {
  // Create properties
  @ApiProperty({ example: 'WH001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  // Create properties
  @ApiProperty({ example: 'Almacén Principal' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  // Create properties
  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  // Create properties
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  city?: string;

  // Create properties
  @ApiProperty({ example: '3001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

