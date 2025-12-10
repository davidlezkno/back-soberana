// Import the core and constants
import { SetMetadata } from '@nestjs/common';
import { UserTypeEnum } from '../../users/constants';

// Const key user roles
export const USER_ROLES_KEY = 'user-roles';

// Decorator user role
export const UserRole = (...roles: UserTypeEnum[]) =>
  SetMetadata(USER_ROLES_KEY, roles);

