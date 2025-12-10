// Import validator
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

// Create class dto login
export class RecoveryPasswordChangeDto {
  @ApiProperty({
    example:
      't8b273xey87ryb278y23b742y3e2yriuyxn8734yr8374gf37b4yn834y3847ft74byf3gn48fy3gn47fyg47f',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ minLength: 5, maxLength: 50, example: '1234567890' })
  @Length(5, 50)
  @IsNotEmpty()
  @IsString()
  password_repeat: string;

  @ApiProperty({ minLength: 5, maxLength: 50, example: '1234567890' })
  @Length(5, 50)
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @IsString()
  code: string;
}

