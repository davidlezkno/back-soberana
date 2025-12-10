// Import core
import {
  Injectable,
  HttpStatus,
  CanActivate,
  HttpException,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Key decorator
import { USER_ROLES_KEY } from '../decorators';

// Constants roles user
import { UserTypeEnum } from '../../users/constants';

// Entity user
import { User } from '../../users/entities/user.entity';

@Injectable()
// Create user role guard
export class UserRoleGuard implements CanActivate {
  // Refactor get metadata
  constructor(private reflector: Reflector) {}

  // Validate guard
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserTypeEnum[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If not roles return true default success
    if (!roles || roles.length === 0) return true;

    // Get user in header
    const request = context.switchToHttp().getRequest();

    // Create const with the user
    const user: User = request.user;

    // If not exist user return Unauthorized
    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // Valid that role exist in user
    if (roles.find((item) => item == user.type)) return true;
    else throw new HttpException(`USER-ROL-INVALID`, HttpStatus.FORBIDDEN);
  }
}

