// Import core
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, HttpStatus, Param } from '@nestjs/common';

// Import services
import { AuthService } from './auth.service';

// Import dto
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { RecoveryPasswordChangeDto } from './dto/recovery-password-change.dto';

// Import decorators
import { Auth, User } from './decorators';
import { User as UserType } from '../users/entities/user.entity';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { UserTypeEnum } from '../users/constants';

// Response utility
import ResponseUtility from '../../utils/response.utility';

// Documentation auth decorators
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // Inject services
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async login(@Body() loginAuthDto: LoginAuthDto) {
    // Call the service
    const result = await this.authService.login(loginAuthDto);

    // Return the response
    return result;
  }

  @Post('register')
  // Restricted for admin user
  @Auth(UserTypeEnum.Admin)
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    // Call the service
    const result = await this.authService.register(registerAuthDto);

    // Return the response
    return result;
  }

  @Post('recovery/password')
  // Restricted for admin user
  @Auth(UserTypeEnum.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    // Call service recovery
    const result = await this.authService.recoveryPassword(recoveryPasswordDto);

    // Return response
    return result;
  }

  @Post('recovery/password/change')
  // Restricted for admin user
  @Auth(UserTypeEnum.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async recoveryPasswordChange(
    @Body() recoveryPasswordChangeDto: RecoveryPasswordChangeDto
  ) {
    // Call service recovery
    const result = await this.authService.recoveryPasswordChange(
      recoveryPasswordChangeDto
    );

    // Return response
    return result;
  }

  // Need auth
  @Auth()
  @Get('valid')
  @ApiBearerAuth()
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async valid(@User() user: UserType) {
    // Return the response
    return user;
  }

  @Get('send/:email')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async sendCode(@Param('email') email: string) {
    // Call the service
    const result = await this.authService.sendCode(email);

    // Return the response
    return ResponseUtility(result);
  }

  @Get('validate/:email/:code')
  // Response documentation decorators
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async validateCode(
    @Param('email') email: string,
    @Param('code') code: string
  ) {
    // Call the service
    const result = await this.authService.validateCode(email, code);

    // Return the response
    return ResponseUtility(result);
  }
}

