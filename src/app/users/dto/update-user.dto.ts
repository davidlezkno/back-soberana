// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import
import {
  IsEmail,
  IsOptional,
  Matches,
  MinLength,
  IsDate,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';
import { UserTypeEnum } from '../constants';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';

// Create class dto
export class UpdateUserDto {
  // Create properties
  @ApiProperty({ example: '123' })
  @IsOptional()
  document: string;

  // Create properties
  @ApiProperty({ example: 'Pedro' })
  @IsOptional()
  name: string;

  // Create properties
  @ApiProperty({ example: 'Perez' })
  @IsOptional()
  surname: string;

  // Create properties
  @ApiProperty({ example: 'correo@mail.com.co' })
  @IsOptional()
  @IsEmail()
  username: string;

  // Create properties
  @ApiProperty({ example: '1234567' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-]+$/, {
    message:
      'La contraseña puede incluir caracteres alfanuméricos y los siguientes caracteres especiales: ! @ # $ % ^ & * ( ) _ + -',
  })
  @Matches(/[!@#$%^&*()_+\-]/, {
    message:
      'La contraseña debe contener al menos un carácter especial: ! @ # $ % ^ & * ( ) _ + -',
  })
  password: string;

  // Create properties
  @ApiProperty({ example: '1234567' })
  @IsOptional()
  password_retry: string;

  // Create properties
  @ApiProperty({ example: 'admin' })
  @IsOptional()
  @Matches(
    `^${Object.values(UserTypeEnum)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i'
  )
  type: string;

  // Create properties
  @ApiProperty({
    description: 'Birth date',
    example: '2013-11-14T12:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  last_password_change?: Date;

  // Create properties
  @ApiProperty({
    description: 'password_change',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  password_change?: boolean;

  // Create properties
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  warehouses?: string[];
}

