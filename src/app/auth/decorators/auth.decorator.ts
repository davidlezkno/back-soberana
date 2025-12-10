// Import core
import { applyDecorators, UseGuards } from '@nestjs/common';

// Import guards
import { JwtAuthGuard, UserRoleGuard } from '../guards';

// Import decorator
import { UserRole } from './user-role.decorator';

// Import type
import { UserTypeEnum } from '../../users/constants';

// Decorator Auth
export function Auth(...roles: UserTypeEnum[]) {
  // Return decorators
  return applyDecorators(
    UserRole(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard)
  );
}

