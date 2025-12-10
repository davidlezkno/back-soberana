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
import { UsersService } from './users.service';

// Import dto
import { CreateUserDto } from './dto/create-user.dto';
import { SelectByRolUserDto, SelectUserDto } from './dto/select-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Import decorators
import { Auth, User } from '../auth/decorators';
import { UserTypeEnum } from './constants';

// Import entity
import { User as UserType } from '../users/entities/user.entity';

// Documentation auth decorators
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  // inject the service
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto) {
    // Call the service
    const result = await this.usersService.create(createUserDto);

    // Return the response
    return ResponseUtility(result);
  }

  @Get()
  // Permission decorator
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findAll(@Query() query: SelectUserDto, @User() user: UserType) {
    // Call the service
    const result = await this.usersService.findAll(query, user);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('by-rol')
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findAllByRol(
    @Query() query: SelectByRolUserDto,
    @User() user: UserType
  ) {
    // Call the service
    const result = await this.usersService.findAllByRol(query, user);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('profile')
  // Permission decorator
  @Auth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async profile(@User() user: UserType) {
    // Call the service
    const result = await this.usersService.profile(user);

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
    const result = await this.usersService.findOne(id);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('email/:email')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async findOneByEmail(@Param('email') email: string) {
    // Call the service
    const result = await this.usersService.findOneByEmail(email);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('validate-password/:email/:password')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async validatePassword(
    @Param('email') email: string,
    @Param('password') password: string
  ) {
    // Call the service
    const result = await this.usersService.validatePassword(email, password);

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
    const result = await this.usersService.reactivate(id);

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
    @Body() updateUserDto: UpdateUserDto
  ) {
    // Call the service
    const result = await this.usersService.update(id, updateUserDto);

    // Return the response
    return ResponseUtility(result);
  }

  @Put('password/:id')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    // Call the service
    const result = await this.usersService.update(id, updateUserDto, true);

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
    const result = await this.usersService.remove(id);

    // Return the response
    return ResponseUtility(result);
  }
}

