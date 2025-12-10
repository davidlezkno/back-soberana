// Import the core
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// Decorator get user in header
export const User = createParamDecorator(
  // Get the context applictaion in the function
  (_: unknown, context: ExecutionContext) => {
    // Get the request
    const request = context.switchToHttp().getRequest();

    // Valid if the user exist
    if (!request.user)
      throw new HttpException('Internal server error', HttpStatus.UNAUTHORIZED);

    // Return the user object
    return request.user;
  }
);

