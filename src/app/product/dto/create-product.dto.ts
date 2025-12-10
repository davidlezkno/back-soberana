// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for quantity item
export class QuantityItemDto {
  @ApiProperty({ example: 35 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: '59ee7f54-76ef-49ba-87ef-abb0e5cbefba' })
  @IsNotEmpty()
  @IsUUID('4')
  warehouse_id: string;
}

// Create class dto
export class CreateProductDto {
  // Create properties
  @ApiProperty({ example: '4779' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  // Create properties
  @ApiProperty({ example: 'Producto de ejemplo' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  // Create properties
  @ApiProperty({ example: 'Descripción detallada del producto' })
  @IsNotEmpty()
  @IsString()
  description: string;

  // Create properties
  @ApiProperty({ example: 'CAJA' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  packagingUnit: string;

  // Create properties
  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  conversionFactor: number;

  // Create properties
  @ApiProperty({ example: 15000.50 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  // Create properties
  @ApiProperty({
    example: [{ quantity: 35, warehouse_id: '59ee7f54-76ef-49ba-87ef-abb0e5cbefba' }],
    type: [QuantityItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuantityItemDto)
  quantities?: QuantityItemDto[];
}

