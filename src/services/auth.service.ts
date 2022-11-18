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
const MILISECONDS_IN_ONE_HOUR = MILISECONDS_IN_ONE_MINUTE * 60;
const MILISECONDS_IN_ONE_DAY = MILISECONDS_IN_ONE_HOUR * 24;

const VERIFICATION_TOKEN_VALIDATION_TIME = 30 * MILISECONDS_IN_ONE_DAY;
const RESET_PASSWORD_TOKEN_VALIDATION_TIME = 15 * MILISECONDS_IN_ONE_MINUTE;

@Service({ transient: true })
export class AuthService {
  constructor(
    private readonly _emailService: EmailService,
    private readonly _credentialsService: CredentialsService,

    private readonly _userRepository: UserRepository
  ) {}

  async signup(user: User) {
    const token = randomBytes(TOKEN_RANDOM_BYTES).toString('hex');
    user.verificationToken = this._credentialsService.hashString(token as string);
    user.password = this._credentialsService.hashString(user.password);
    user.verificationTokenExpirationDate = this.getUserVerificationTokenExpirationDate();

    user = await this.createUser(user);

    // NOTE: I save the encrypted token but I send the User the decrpyted one
    user.verificationToken = token;
    await this._emailService.sendVerifyAccountEmail(user);

    return user;
  }

  private getUserVerificationTokenExpirationDate() {
    const currentTimestamp = getCurrentDate().getTime();
    const verificationTokenExpirationTimestamp =
      currentTimestamp + VERIFICATION_TOKEN_VALIDATION_TIME;
    return new Date(verificationTokenExpirationTimestamp);
  }

  private async createUser(user: User) {
    const { email } = user;
    try {
      let existingUser = await this._userRepository.findOne({ email });
      this.validateExistingUser(existingUser);

      return this._userRepository.update(existingUser);
    } catch (error: any) {
      if (error.details) {
        throw error;
      }
      return this._userRepository.create(user);
    }
  }

  private validateExistingUser(user: User) {
    const { verificationTokenExpirationDate, email, isActive, _id: userId } = user;

    if (isActive) {
      throw new ConflictError(`User with email ${email} already exists`, [{ userId }]);
    }

    const verificationTokenExpirationTimestamp = verificationTokenExpirationDate
      ? verificationTokenExpirationDate.getTime()
      : 1;
    const currentTimestamp = getCurrentDate().getTime();

    if (currentTimestamp < verificationTokenExpirationTimestamp) {
      throw new ConflictError(`User with email ${email} already exists`, [{ userId }]);
    }
  }

  async verifyAccount(hashedInfo: string) {
    let user: User;
    try {
      user = await this.validateVerificationToken(hashedInfo);
    } catch (error) {
      throw new NotFoundError('Incorrect link');
    }

    return this.updateVerifiedUser(user);
  }

  async updateVerifiedUser(user: User) {
    user.isVerified = true;
    user.isActive = true;
    user.verificationToken = null;
    user.verificationTokenExpirationDate = null;

    await this._userRepository.update(user);
    return this._credentialsService.createUserCookies(user);
  }

  private async validateVerificationToken(hashedInfo: string) {
    const data = await this._credentialsService.getJWTData(hashedInfo);
    const { userId, verificationToken } = data.data;

    const user = await this._userRepository.findById(userId);

    const currentDate = getCurrentDate();
    const isTokenCorrect =
      user.verificationToken &&
      this._credentialsService.compareHash(verificationToken, user.verificationToken);
    const isTokenExpired =
      user.verificationTokenExpirationDate && currentDate > user.verificationTokenExpirationDate;

    const validationsOK = !user.isActive && !user.isVerified && isTokenCorrect && !isTokenExpired;

    if (!validationsOK) {
      throw new NotFoundError('Incorrect link');
    }

    return user;
  }

  async login(email: string, password: string) {
    let user: User;

    try {
      user = await this.validateLoginCredentials(email, password);
    } catch (error: any) {
      if (!error.details) {
        throw new ForbiddenError('Email or Password incorrect');
      }
      throw error;
    }

    return this._credentialsService.createUserCookies(user);
  }

  private async validateLoginCredentials(email: string, password: string) {
    const user = await this._userRepository.findOne({ email });
    const { isActive, isVerified, verificationTokenExpirationDate, _id: userId } = user;

    const currentTimestamp = getCurrentDate().getTime();
    if (
      !isVerified &&
      verificationTokenExpirationDate &&
      verificationTokenExpirationDate.getTime() > currentTimestamp
    ) {
      throw new ForbiddenError('You have to verify your account first', [{ userId }]);
    }

    const isPasswordCorrect = this._credentialsService.compareHash(password, user.password);

    const validationsOK = isPasswordCorrect && isActive;

    if (!validationsOK) {
      throw new ForbiddenError('Email or Password incorrect');
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

    const currentTimestamp = getCurrentDate().getTime();
    const resetPasswordTokenExpirationTimestamp =
      currentTimestamp + RESET_PASSWORD_TOKEN_VALIDATION_TIME;
    const resetPasswordTokenExpirationDate = new Date(resetPasswordTokenExpirationTimestamp);
    user.resetPasswordTokenExpirationDate = resetPasswordTokenExpirationDate;

    await this._userRepository.update(user);

    // NOTE: I save the encrypted token but I the User the decrpyted one
    user.resetPasswordToken = token;
    await this._emailService.sendForgotPasswordEmail(user);
  }

  private async validateForgotPassword(email: string) {
    const user = await this._userRepository.findOne({ email });
    const { isActive, isVerified, verificationTokenExpirationDate } = user;

    const currentTimestamp = getCurrentDate().getTime();
    const isTokenExpired =
      verificationTokenExpirationDate &&
      currentTimestamp > verificationTokenExpirationDate.getTime();

    const validationsOK = isActive || (!isVerified && !isTokenExpired);

    if (!validationsOK) {
      throw new NotFoundError(`User with email ${email} does not exist`);
    }

    return user;
  }

  async getUserToResetPassword(hashedInfo: string) {
    let user: User;
    try {
      const data = await this._credentialsService.getJWTData(hashedInfo);
      const { userId, resetPasswordToken } = data.data;

      user = await this._userRepository.findById(userId);

      const { isActive, isVerified, verificationTokenExpirationDate } = user;

      const currentTimestamp = getCurrentDate().getTime();
      const isVerificationTokenExpired =
        verificationTokenExpirationDate &&
        currentTimestamp > verificationTokenExpirationDate.getTime();

      const userValidationsOK = isActive || (!isVerified && !isVerificationTokenExpired);
      if (!userValidationsOK) {
        throw new NotFoundError('Incorrect link');
      }

      const isTokenCorrect =
        user.resetPasswordToken &&
        this._credentialsService.compareHash(resetPasswordToken, user.resetPasswordToken);
      const isTokenExpired =
        user.resetPasswordTokenExpirationDate &&
        currentTimestamp > user.resetPasswordTokenExpirationDate.getTime();

      if (!isTokenCorrect || isTokenExpired) {
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
