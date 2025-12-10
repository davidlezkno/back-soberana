// Import the NestJS Controller decorator
import { Controller, Get, HttpStatus } from '@nestjs/common';

// Import Swagger
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// Response utility
import ResponseUtility from '../../utils/response.utility';

// Import services
import { CountriesService } from './countries.service';

// Import decorators
import { Auth } from '../auth/decorators';

// Documentation auth decorators
@ApiBearerAuth()
@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  // inject the service
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async getAll() {
    // Call the service
    const result = await this.countriesService.getAll();

    // Return the response
    return ResponseUtility(result);
  }
}

