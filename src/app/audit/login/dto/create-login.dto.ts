// Import Swagger
import { ApiProperty } from '@nestjs/swagger';

// Import class-validator
import { IsNotEmpty } from 'class-validator';

// Create class dto
export class CreateLoginAuditDto {
  @ApiProperty({ example: 'USERNAME' })
  @IsNotEmpty()
  username: string;
}

