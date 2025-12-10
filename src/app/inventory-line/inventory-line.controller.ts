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

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import ResponseUtility from '../../utils/response.utility';

import { InventoryLineService } from './inventory-line.service';

import { CreateInventoryLineDto } from './dto/create-inventory-line.dto';
import { SelectInventoryLineDto } from './dto/select-inventory-line.dto';
import { UpdateInventoryLineDto } from './dto/update-inventory-line.dto';

import { Auth, User } from '../auth/decorators';
import { UserTypeEnum } from '../users/constants';

import { User as UserType } from '../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Inventory Lines')
@Controller('inventory-lines')
export class InventoryLineController {
  constructor(private readonly inventoryLineService: InventoryLineService) {}

  @Post()
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(
    @Body() createInventoryLineDto: CreateInventoryLineDto,
    @User() user: UserType
  ) {
    const result = await this.inventoryLineService.create(createInventoryLineDto, user);
    return ResponseUtility(result);
  }

  @Get()
  @Auth(UserTypeEnum.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findAll(@Query() query: SelectInventoryLineDto, @User() user: UserType) {
    const result = await this.inventoryLineService.findAll(query, user);
    return ResponseUtility(result);
  }

  @Get('by-inventory-count/:inventoryCountId')
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findByInventoryCountId(
    @Param('inventoryCountId', ParseUUIDPipe) inventoryCountId: string
  ) {
    const result = await this.inventoryLineService.findByInventoryCountId(inventoryCountId);
    return ResponseUtility(result);
  }

  @Get(':id')
  @Auth(UserTypeEnum.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.inventoryLineService.findOne(id);
    return ResponseUtility(result);
  }

  @Put(':id')
  @Auth(UserTypeEnum.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInventoryLineDto: UpdateInventoryLineDto,
    @User() user: UserType
  ) {
    const result = await this.inventoryLineService.update(id, updateInventoryLineDto, user);
    return ResponseUtility(result);
  }

  @Delete(':id')
  @Auth(UserTypeEnum.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserType
  ) {
    const result = await this.inventoryLineService.remove(id, user);
    return ResponseUtility(result);
  }
}
