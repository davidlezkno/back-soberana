// Import core
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Import services
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

// Import the passport
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
// JWT strategoy, valid de jwt token
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    // Send property to the super class
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * validate
   * @param  {any} payload
   */
  async validate(payload: any) {
    // If exist the code
    if (payload.code) return payload;

    // Validate the auth
    const users = await this.authService.user(payload.id);

    // If the user is inactive return UNAUTHORIZED
    if (users.active != true)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // Return the user
    return users;
  }
}

