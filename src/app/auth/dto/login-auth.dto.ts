// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsNotEmpty } from 'class-validator';

// Login class dto
export class LoginAuthDto {
  // Login properties
  @ApiProperty({ example: 'adminuser@soberana.com' })
  @IsNotEmpty()
  username: string;

  // Login properties
  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  password: string;

  // Login properties
  @ApiProperty({ example: 'ggsgsgsgsee53fsfs53v' })
  @IsNotEmpty()
  captcha: string;
}

