// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

// Create class dto
export class CreateWarehouseDto {
  // Create properties
  @ApiProperty({ example: 'WH001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  // Create properties
  @ApiProperty({ example: 'Almacén Principal' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

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
  cityId?: string;

  // Create properties
  @ApiProperty({ example: '3001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

