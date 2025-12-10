// import swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-transformer
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

// Create class dto
export class SelectInventoryLineDto {
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
    description: 'Inventory Count ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4')
  inventoryCountId?: string;

  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    type: String,
    example: '2024-10-26T15:30:00Z',
  })
  @IsOptional()
  @IsString()
  created_at?: string;
}

