import { Service } from 'typedi';
import { randomBytes } from 'crypto';

import {
  ConflictError,
  ForbiddenError,
  IncorrectFormatError,
  NotFoundError,
  UnauthorizedError
} from '../errors/base.error';

import { EmailService } from './email.service';
import { CredentialsService } from './credentials.service';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../interfaces';
import { getCurrentDate } from '../utils/getCurrentDate';

const TOKEN_RANDOM_BYTES = 40;

const MILISECONDS_IN_ONE_MINUTE = 1000 * 60;

const RESET_PASSWORD_TOKEN_VALIDATION_TIME = 15 * MILISECONDS_IN_ONE_MINUTE;

@Service({ transient: true })
export class AuthService {
  constructor(
    private readonly _emailService: EmailService,
    private readonly _credentialsService: CredentialsService,

    private readonly _userRepository: UserRepository
  ) {}

  async signup(user: User) {
    const { email } = user;
    user.password = this._credentialsService.hashString(user.password);

    try {
      let existingUser = await this._userRepository.findOne({ email });

      const { isActive, _id: userId } = existingUser;

      if (isActive) {
        throw new ConflictError(`User with email ${email} already exists`, [{ userId }]);
      }
    } catch (error: any) {
      if (error.details) {
        throw error;
      }
    }

    const newUser = await this._userRepository.create(user);
    const cookies = await this._credentialsService.createUserCookies(newUser);

    return { ...cookies, user: newUser };
  }

  async login(email: string, password: string) {
    let user: User;

    try {
      user = await this.validateLoginCredentials(email, password);
    } catch (error) {
      throw new UnauthorizedError('Email or Password incorrect');
    }

    const cookies = await this._credentialsService.createUserCookies(user);

    return { ...cookies, name: user.firstName, userId: user._id };
  }

  private async validateLoginCredentials(email: string, password: string) {
    const user = await this._userRepository.findOne({ email });
    const { isActive } = user;

    const isPasswordCorrect = this._credentialsService.compareHash(password, user.password);

    const validationsOK = isPasswordCorrect && isActive;

    if (!validationsOK) {
      throw new UnauthorizedError('Email or Password incorrect');
    }

    return user;
  }

  async forgotPassword(email: string) {
    let user: User;
    try {
      user = await this.validateForgotPassword(email);
    } catch (error) {
      throw new NotFoundError(`User with email ${email} does not exist`);
    }

    const token = randomBytes(TOKEN_RANDOM_BYTES).toString('hex');

    user.resetPasswordToken = this._credentialsService.hashString(token as string);
    user.resetPasswordTokenExpirationDate = this.getResetPasswordTokenExpirationDate();

    await this._userRepository.update(user);

    // NOTE: I save the encrypted token but I the User the decrpyted one
    user.resetPasswordToken = token;
    await this._emailService.sendForgotPasswordEmail(user);
  }

  private async validateForgotPassword(email: string) {
    const user = await this._userRepository.findOne({ email });
    const { isActive } = user;

    if (!isActive) {
      throw new NotFoundError(`User with email ${email} does not exist`);
    }

    return user;
  }

  private getResetPasswordTokenExpirationDate() {
    const currentTimestamp = getCurrentDate().getTime();
    const resetPasswordTokenExpirationTimestamp =
      currentTimestamp + RESET_PASSWORD_TOKEN_VALIDATION_TIME;

    return new Date(resetPasswordTokenExpirationTimestamp);
  }

  async getUserToResetPassword(hashedInfo: string) {
    let user: User;
    try {
      const data = await this._credentialsService.getJWTData(hashedInfo);
      const { userId, resetPasswordToken } = data.data;

      user = await this._userRepository.findById(userId);

      const { isActive } = user;

      const userValidationsOK = isActive;
      if (!userValidationsOK) {
        throw new NotFoundError('Incorrect link');
      }

      const isTokenCorrect =
        user.resetPasswordToken &&
        this._credentialsService.compareHash(resetPasswordToken, user.resetPasswordToken);

      if (!isTokenCorrect) {
        throw new NotFoundError('Incorrect link');
      }
    } catch (error) {
      throw new NotFoundError('Incorrect link');
    }

    return user;
  }

  async resetPassword(hashedInfo: string, newPassword: string) {
    let user: User;
    try {
      user = await this.getUserToResetPassword(hashedInfo);
    } catch (error) {
      throw new UnauthorizedError('Unauthorized');
    }

    const isEqualToLastPassword = this._credentialsService.compareHash(newPassword, user.password);
    if (isEqualToLastPassword) {
      throw new IncorrectFormatError('New password must be different than current password');
    }

    user.resetPasswordToken = null;
    user.resetPasswordTokenExpirationDate = null;
    user.password = this._credentialsService.hashString(newPassword);

    await this._userRepository.update(user);
    return user;
  }
}
