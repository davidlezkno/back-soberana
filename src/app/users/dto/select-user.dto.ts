// import swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-transformer
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// Import Enum
import { UserTypeEnum } from '../constants';

// Create class dto
export class SelectUserDto {
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
    description: '12345678',
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    description: 'Jhon',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Doe',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({
    description: 'johndoe@gmail.com',
  })
  @IsOptional()
  @IsString()
  username?: string;

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

  @ApiProperty({
    description: 'Fecha de actualización de constraseña',
    type: String,
    example: '2024-10-26T15:30:00Z',
  })
  @IsOptional()
  @IsString()
  last_password_change?: string;

  @ApiProperty({
    description: 'password_change',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'false' || value === false)
  @IsBoolean()
  password_change?: boolean;
}

export class SelectByRolUserDto extends SelectUserDto {
  // The rol
  @ApiProperty({
    default: UserTypeEnum.User,
    nullable: true,
    required: false,
    description: 'Any rol',
  })
  @IsOptional()
  @IsString()
  rol?: string;
}

