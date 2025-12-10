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
import { CitiesService } from './cities.service';

// Import decorators
import { Auth } from '../auth/decorators';

// Documentation auth decorators
@ApiBearerAuth()
@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  // inject the service
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async getAll() {
    // Call the service
    const result = await this.citiesService.getAll();

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
    const result = await this.citiesService.findById(id);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('department/:departmentId')
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findByDepto(@Param('departmentId', ParseUUIDPipe) departmentId: string) {
    // Call the service
    const result = await this.citiesService.findByDepto(departmentId);

    // Return the response
    return ResponseUtility(result);
  }
}

