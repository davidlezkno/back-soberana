// Import validator
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// Create class dto login
export class RecoveryPasswordDto {
  // Create properties
  @ApiProperty({ example: 'adminuser@soberana.com' })
  @IsNotEmpty()
  username: string;
}

