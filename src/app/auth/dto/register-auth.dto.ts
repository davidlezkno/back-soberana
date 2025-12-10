// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsEmail, IsNotEmpty } from 'class-validator';

// Create class dto
export class RegisterAuthDto {
  
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  code: string;

  
  @ApiProperty({ example: 'Name' })
  @IsNotEmpty()
  name: string;

  
  @ApiProperty({ example: 'Surname' })
  @IsNotEmpty()
  surname: string;

  
  @ApiProperty({ example: 'adminuser@soberana.com' })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  
  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  password: string;

  
  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  password_retry: string;
}

