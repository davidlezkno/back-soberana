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

// Import typeorm
import { FindOptionsWhere } from 'typeorm';

// Import Swagger
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// Response utility
import ResponseUtility from '../../utils/response.utility';

// Import services
import { WarehouseService } from './warehouse.service';

// Import dto
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { SelectWarehouseDto } from './dto/select-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { FindOneByWarehouseDto } from './dto/find-one-by-warehouse.dto';

// Import decorators
import { Auth, User } from '../auth/decorators';
import { UserTypeEnum } from '../users/constants';

// Import entity
import { User as UserType } from '../users/entities/user.entity';
import { Warehouse } from './entities/warehouse.entity';

// Documentation auth decorators
@ApiBearerAuth()
@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  // inject the service
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    // Call the service
    const result = await this.warehouseService.create(createWarehouseDto);

    // Return the response
    return ResponseUtility(result);
  }

  @Get()
  // Permission decorator
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findAll(@Query() query: SelectWarehouseDto, @User() user: UserType) {
    // Call the service
    const result = await this.warehouseService.findAll(query, user);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('find-one-by')
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findOneBy(@Query() query: FindOneByWarehouseDto) {
    // Build where object from query params
    const where: FindOptionsWhere<Warehouse> = {};
    
    if (query.id) where.id = query.id;
    if (query.code) where.code = query.code;
    if (query.name) where.name = query.name;
    if (query.active !== undefined) where.active = query.active;
    if (query.city) where.city = { id: query.city } as any;

    // Call the service with pagination if provided
    const result = await this.warehouseService.findOneBy(
      where,
      query.limit,
      query.page
    );

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
    const result = await this.warehouseService.findOneByCode(code);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('user/:userId')
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    // Call the service
    const result = await this.warehouseService.findByUser(userId);

    // Return the response
    return ResponseUtility(result);
  }

  @Get(':id')
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Call the service
    const result = await this.warehouseService.findOne(id);

    // Return the response
    return ResponseUtility(result);
  }

  @Put('reactivate/:id')
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async reactivate(@Param('id', ParseUUIDPipe) id: string) {
    // Call the service
    const result = await this.warehouseService.reactivate(id);

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
    @Body() updateWarehouseDto: UpdateWarehouseDto
  ) {
    // Call the service
    const result = await this.warehouseService.update(id, updateWarehouseDto);

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
    const result = await this.warehouseService.remove(id);

    // Return the response
    return ResponseUtility(result);
  }
}

