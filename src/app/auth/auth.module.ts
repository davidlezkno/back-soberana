// Import core
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entries
import { User } from '../users/entities/user.entity';

// Import modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Import services
import { AuthService } from './auth.service';

// Import controllers
import { AuthController } from './auth.controller';

// Import strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../services/email/email.module';
import { LoginAuditModule } from '../audit';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    EmailModule,
    LoginAuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

