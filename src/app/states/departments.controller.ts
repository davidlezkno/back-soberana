// Import the NestJS Controller decorator
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

// Import Swagger
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// Response utility
import ResponseUtility from '../../utils/response.utility';

// Import services
import { DepartmentsService } from './departments.service';

// Import decorators
import { Auth } from '../auth/decorators';

// Documentation auth decorators
@ApiBearerAuth()
@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  // inject the service
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async getAll() {
    // Call the service
    const result = await this.departmentsService.getAll();

    // Return the response
    return ResponseUtility(result);
  }

  @Get(':id')
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    // Call the service
    const result = await this.departmentsService.findById(id);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('country/:countryId')
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findByCountry(@Param('countryId', ParseUUIDPipe) countryId: string) {
    // Call the service
    const result = await this.departmentsService.findByCountry(countryId);

    // Return the response
    return ResponseUtility(result);
  }
}

