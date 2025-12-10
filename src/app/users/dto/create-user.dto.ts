// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsEmail, IsNotEmpty, Matches, MinLength, IsOptional, IsArray, IsUUID } from 'class-validator';

// Import constants
import { UserTypeEnum } from '../constants';

// Create class dto
export class CreateUserDto {
  // Create properties
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  document: string;

  // Create properties
  @ApiProperty({ example: 'Pedro' })
  @IsNotEmpty()
  name: string;

  // Create properties
  @ApiProperty({ example: 'Perez' })
  @IsNotEmpty()
  surname: string;

  // Create properties
  @ApiProperty({ example: 'correo@mail.com.co' })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  // Create properties
  @ApiProperty({ example: '1234567' })
  @IsNotEmpty()
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
  @IsNotEmpty()
  password_retry: string;

  // Create properties
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @Matches(
    `^${Object.values(UserTypeEnum)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i'
  )
  type: string;

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

