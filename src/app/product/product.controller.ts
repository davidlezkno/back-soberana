// Import the NestJS Controller decorator
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

// Import Swagger
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// Response utility
import ResponseUtility from '../../utils/response.utility';

// Import services
import { ProductService } from './product.service';

// Import dto
import { CreateProductDto } from './dto/create-product.dto';
import { SelectProductDto } from './dto/select-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Import decorators
import { Auth, User } from '../auth/decorators';
import { UserTypeEnum } from '../users/constants';

// Import entity
import { User as UserType } from '../users/entities/user.entity';

// Documentation auth decorators
@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {
  // inject the service
  constructor(private readonly productService: ProductService) {}

  @Post()
  // Permission decorator
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @User() user: UserType
  ) {
    // Call the service
    const result = await this.productService.create(createProductDto, user);

    // Return the response
    return ResponseUtility(result);
  }

  @Get()
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findAll(@Query() query: SelectProductDto, @User() user: UserType) {
    // Call the service
    const result = await this.productService.findAll(query, user);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('code/:code')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findOneByCode(@Param('code') code: string) {
    // Call the service
    const result = await this.productService.findOneByCode(code);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('user/:userId')
  // Permission decorator
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    // Call the service
    const result = await this.productService.findByUserId(userId);

    // Return the response
    return ResponseUtility(result);
  }

  @Get(':id')
  // Permission decorator
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Call the service
    const result = await this.productService.findOne(id);

    // Return the response
    return ResponseUtility(result);
  }

  @Put('reactivate/:id')
  // Permission decorator
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async reactivate(@Param('id', ParseUUIDPipe) id: string) {
    // Call the service
    const result = await this.productService.reactivate(id);

    // Return the response
    return ResponseUtility(result);
  }

  @Put(':id')
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: UserType
  ) {
    // Call the service
    const result = await this.productService.update(id, updateProductDto, user);

    // Return the response
    return ResponseUtility(result);
  }

  @Delete(':id')
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    // Call the service
    const result = await this.productService.remove(id);

    // Return the response
    return ResponseUtility(result);
  }
}

