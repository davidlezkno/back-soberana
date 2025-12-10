// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import
import { IsOptional, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// Create class dto
export class UpdateInventoryLineDto {
  // Create properties
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID('4')
  inventoryCountId?: string;

  // Create properties
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID('4')
  productId?: string;

  // Create properties
  @ApiProperty({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantityPackaging?: number;

  // Create properties
  @ApiProperty({ example: 120 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantityUnits?: number;
}

