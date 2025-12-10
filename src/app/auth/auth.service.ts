// Import core
import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { JwtService } from '@nestjs/jwt';

// Import typeorm
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

// Import dto
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { RecoveryPasswordChangeDto } from './dto/recovery-password-change.dto';

// Import services
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../services/email/email.service';
import { LoginAuditService } from '../audit';

// Import the hash library
import { compare, hash } from 'bcrypt';

// Imports
import { URL_CAPTCHA, exceptions } from './constants';
import { Exception } from 'src/utils/exception.utility';

@Injectable()
export class AuthService {
  private readonly MAILER_URL = this.configService.get('MAILER_URL');
  private readonly MAILER_API_KEY = this.configService.get('MAILER_API_KEY');

  // Inject services
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly loginAuditService: LoginAuditService
  ) {}

  /**
   * Login
   * @description Login the user
   * @param  {LoginAuthDto} loginAuthDto
   */
  async login(loginAuthDto: LoginAuthDto) {
    // Find the user
    const result = await this.usersRepository
      .findOne({
        where: { username: ILike(loginAuthDto.username.trim()) },
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // Check if the user is valid
    if (!result) throw Exception(exceptions.not_auth);

    // Check if the user is active
    if (!result.active) throw Exception(exceptions.user_inactive);

    // Compare the password
    const valid = await compare(loginAuthDto.password, result.password);

    // Check if the password is valid
    if (!valid) throw Exception(exceptions.not_auth);

    // Check if password was changed more than 30 days ago
    if (result.password_change) {
      const lastChangeDate = new Date(result.last_password_change);
      const currentDate = new Date();
      const diffInDays = Math.floor(
        (currentDate.getTime() - lastChangeDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (diffInDays >= 30) {
        throw Exception(exceptions.password_expired);
      }
    }

    const access_token = this.jwtService.sign({ id: result.id });

    if (!loginAuthDto.captcha) throw Exception(exceptions.not_captcha);

    const resCaptcha = await axios.get(
      `${URL_CAPTCHA}${process.env.CAPTCHA_KEY}&response=${loginAuthDto.captcha}`
    );

    if (!resCaptcha || resCaptcha.status !== 200 || !resCaptcha.data.success)
      throw Exception(exceptions.not_captcha);

    this.loginAuditService.create({
      username: result.username,
    });

    // Return the result
    return {
      token: access_token,
      user: {
        username: result.username,
        surname: result.surname,
        name: result.name,
        type: result.type,
        id: result.id,
      },
    };
  }

  /**
   * Register
   * @description Register the user
   * @param  {RegisterAuthDto} registerAuthDto
   */
  async register(registerAuthDto: RegisterAuthDto) {
    // Check if the password is valid
    if (registerAuthDto.password !== registerAuthDto.password_retry)
      throw Exception(exceptions.bad_request);

    // Create the password hash
    const password_hash = await hash(
      registerAuthDto.password,
      parseInt(this.configService.get<string>('PASSWORD_HASH_SALT'))
    );

    // Create the user
    const user = await this.usersRepository
      .save({
        password: password_hash,
        code: registerAuthDto.code.trim(),
        name: registerAuthDto.name.trim(),
        surname: registerAuthDto.surname.trim(),
        username: registerAuthDto.username.toLowerCase().trim(),
      })
      .catch((error) => {
        // Catch error in database transaction duplicated
        if (error.code === '23505')
          throw Exception(
            error.detail.includes('username')
              ? exceptions.duplicated
              : exceptions.duplicatedCode
          );

        // Catch error in database transaction
        throw Exception(exceptions.user_inactive, [], error);
      });

    // Ensure result is a single User (not an array)
    const savedUser = Array.isArray(user) ? user[0] : user;

    // Return the result
    return savedUser;
  }

  /**
   * Recovery password
   * @description Recovery password the user
   * @param  {RecoveryPasswordDto} recoveryPasswordDto
   */
  async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
    // Find the user
    const result = await this.usersRepository
      .findOne({
        where: { username: ILike(recoveryPasswordDto.username.trim()) },
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // Check if the user is active
    if (!result) throw Exception(exceptions.not_auth);

    const code = String(Math.floor(Math.random() * (9999 - 1111 + 1) + 1111));

    // Create the code hash
    const code_hash = await hash(
      code,
      parseInt(this.configService.get<string>('PASSWORD_HASH_SALT'))
    );

    // Create token
    const access_token = this.jwtService.sign(
      {
        id: result.id,
        code: code_hash,
        email: result.username,
      },
      { expiresIn: '10m' }
    );

    await this.emailService.send({
      to: result.username,
      template_id: 'd-5ccfa661ac914395aa617ef89e866066',
      params: {
        code: code,
      },
    });

    return {
      token: access_token,
    };
  }

  /**
   * Recovery password
   * @description Recovery password the user
   * @param  {RecoveryPasswordChangeDto} recoveryPasswordChangeDto
   */
  async recoveryPasswordChange(
    recoveryPasswordChangeDto: RecoveryPasswordChangeDto
  ) {
    let valid:
      | any
      | {
          email: string;
          code: string;
          id: string;
        };

    try {
      // Verify the token
      valid = await this.jwtService.verifyAsync(
        recoveryPasswordChangeDto.token
      );
    } catch {
      throw Exception(exceptions.not_auth);
    }

    // Valid if the token is valid
    if (!valid) throw Exception(exceptions.not_auth, []);

    // Compare the password
    const valid_code = await compare(
      recoveryPasswordChangeDto.code,
      valid.code
    );

    // Check if the password is valid
    if (!valid_code) throw Exception(exceptions.not_auth);

    // Valid if the password is valid
    if (
      recoveryPasswordChangeDto.password !=
      recoveryPasswordChangeDto.password_repeat
    )
      throw Exception(exceptions.bad_request);

    // Create the password hash
    const password_hash = await hash(
      recoveryPasswordChangeDto.password,
      parseInt(this.configService.get<string>('PASSWORD_HASH_SALT'))
    );

    // Find the user
    const user = await this.usersRepository
      .findOne({
        where: { id: valid.id, username: valid.email },
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_find, [], error);
      });

    // Save record
    await this.usersRepository
      .save({
        ...user,
        password: password_hash,
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.error_update, [], error);
      });
    return true;
  }

  /**
   * Valid
   * @description Check if the user is valid
   * @param  {string} id
   */
  async user(id: string): Promise<User> {
    // Find the user
    const result = await this.usersRepository
      .findOne({
        where: { id: id, active: true },
      })
      .catch((error) => {
        // Catch error in database transaction
        throw Exception(exceptions.user_inactive, [], error);
      });

    // Check if the user is active
    if (!result) throw Exception(exceptions.user_inactive);

    // Return the result
    return result;
  }

  /**
   * Send code validation security
   * @param email
   */
  async sendCode(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const payload = {
      method: 'EMAIL',
      contact: email,
    };

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.MAILER_URL}/api/otp/generate`,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'x-api-key': this.MAILER_API_KEY,
      },
      data: payload,
    };

    try {
      const { data }: AxiosResponse<{ success: boolean; message: string }> =
        await axios.request(config);
      return data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: 'Unknown error occurred',
        }
      );
    }
  }

  /**
   * Validate code security
   * @param email
   * @param code
   */
  async validateCode(
    email: string,
    code: string
  ): Promise<{ status: boolean; message: string }> {
    const payload = {
      method: 'EMAIL',
      otp: code,
      contact: email,
    };

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.MAILER_URL}/api/otp/verify`,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'x-api-key': this.MAILER_API_KEY,
      },
      data: payload,
    };

    try {
      const { data }: AxiosResponse<{ status: boolean; message: string }> =
        await axios.request(config);
      return data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          message: 'Unknown error occurred',
        }
      );
    }
  }
}

