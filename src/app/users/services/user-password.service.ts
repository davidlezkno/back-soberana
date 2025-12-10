import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { Exception } from '../../../utils/exception.utility';
import { exceptions } from '../constants';

@Injectable()
export class UserPasswordService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * HashPassword
   * @description Hash a password
   * @param  {string} password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = parseInt(this.configService.get<string>('PASSWORD_HASH_SALT'));
    return hash(password, salt);
  }

  /**
   * ValidatePassword
   * @description Validate password match
   * @param  {string} plainPassword
   * @param  {string} hashedPassword
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  /**
   * ValidatePasswordMatch
   * @description Validate that password and password_retry match
   * @param  {string} password
   * @param  {string} passwordRetry
   */
  validatePasswordMatch(password: string, passwordRetry: string): void {
    if (password !== passwordRetry) {
      throw Exception(exceptions.bad_request);
    }
  }
}

