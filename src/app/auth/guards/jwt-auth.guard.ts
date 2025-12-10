// Import core
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Import password
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Create gauard valid jwt
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * handleRequest
   * @param  {any} error
   * @param  {any} user
   */
  handleRequest(error: any, user: any) {
    // If error exists and user not exist
    if (error || !user) {
      // Call error UnauthorizedException
      throw error || new UnauthorizedException();
    }

    // Return the user object
    return user;
  }
}

