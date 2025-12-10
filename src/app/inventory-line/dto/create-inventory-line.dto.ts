// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// Create class dto
export class CreateInventoryLineDto {
  // Create properties
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID('4')
  inventoryCountId: string;

  // Create properties
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID('4')
  productId: string;

  // Create properties
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantityPackaging: number;

  // Create properties
  @ApiProperty({ example: 120 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantityUnits: number;
}

