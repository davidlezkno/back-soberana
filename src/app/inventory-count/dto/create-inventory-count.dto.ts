// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsNotEmpty, IsOptional, IsUUID, IsDate, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Create class dto
export class CreateInventoryCountDto {
  // Create properties
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID('4')
  warehouseId: string;

  // Create properties
  @ApiProperty({ example: '2024-12-31' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  cutOffDate: Date;

  // Create properties
  @ApiProperty({ example: 1, description: '1, 2 o 3' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  countNumber: number;

  // Create properties
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  status?: boolean;
}

