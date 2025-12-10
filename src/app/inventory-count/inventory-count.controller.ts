import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import ResponseUtility from '../../utils/response.utility';

import { InventoryCountService } from './inventory-count.service';

import { CreateInventoryCountDto } from './dto/create-inventory-count.dto';

import { Auth, User } from '../auth/decorators';
import { UserTypeEnum } from '../users/constants';

import { User as UserType } from '../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Inventory Counts')
@Controller('inventory-counts')
export class InventoryCountController {
  constructor(
    private readonly inventoryCountService: InventoryCountService
  ) {}

  @Post()
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(
    @Body() createInventoryCountDto: CreateInventoryCountDto,
    @User() user: UserType
  ) {
    const result = await this.inventoryCountService.create(
      createInventoryCountDto,
      user
    );

    return ResponseUtility(result);
  }

  @Get('warehouse/:warehouseId')
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findByWarehouse(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
    @Query('countDate') countDate?: string
  ) {
    const result = await this.inventoryCountService.findByWarehouse(warehouseId, countDate);
    return ResponseUtility(result);
  }

  @Put('finish/:inventoryId')
  @Auth(UserTypeEnum.Admin, UserTypeEnum.User)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async finish(
    @Param('inventoryId', ParseUUIDPipe) inventoryId: string
  ) {
    const result = await this.inventoryCountService.finish(inventoryId);

    return ResponseUtility(result);
  }
}
