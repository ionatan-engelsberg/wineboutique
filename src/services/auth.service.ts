import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { randomBytes } from 'crypto';

import { JWT_LIFETIME, JWT_SECRET } from '../config/config';
import { ConflictError, InternalServerError, NotFoundError } from '../errors/base.error';

import { EmailService } from './email.service';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../interfaces';
import { getCurrentDate } from '../utils/getCurrentDate';

const MILISECONDS_IN_ONE_HOUR = 1000 * 60 * 60;
const MILISECONDS_IN_ONE_DAY = MILISECONDS_IN_ONE_HOUR * 24;
const VERIFICATION_TOKEN_VALIDATION_TIME = 30 * MILISECONDS_IN_ONE_DAY;

@Service({ transient: true })
export class AuthService {
  constructor(
    private readonly _emailService: EmailService,

    private readonly _userRepository: UserRepository
  ) {}

  async signup(user: User) {
    const token = randomBytes(40).toString('hex');
    user.verificationToken = this.hashString(token as string);

    user.password = this.hashString(user.password);

    const currentTimestamp = getCurrentDate().getTime();
    const verificationTokenExpirationTimestamp =
      currentTimestamp + VERIFICATION_TOKEN_VALIDATION_TIME;
    const verificationTokenExpirationDate = new Date(verificationTokenExpirationTimestamp);
    user.verificationTokenExpirationDate = verificationTokenExpirationDate;

    user = await this.createUser(user);

    user.verificationToken = token;
    await this._emailService.sendVerifyAccountEmail(user);

    return user;
  }

  private hashString(password: string) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  private async createUser(user: User) {
    const { email } = user;
    try {
      let existingUser = await this._userRepository.findOne({ email });

      if (existingUser.isActive) {
        throw new ConflictError(`User with email ${email} already exists`, [
          { userId: existingUser._id }
        ]);
      }

      const { verificationTokenExpirationDate } = user;
      const verificationTokenExpirationTimestamp = verificationTokenExpirationDate
        ? verificationTokenExpirationDate.getTime()
        : 1;
      const currentDate = getCurrentDate().getTime();

      if (currentDate < verificationTokenExpirationTimestamp) {
        throw new ConflictError(`User with email ${email} already exists`, [
          { userId: existingUser._id }
        ]);
      }

      return this._userRepository.update(existingUser);
    } catch (error: any) {
      if (error.details) {
        throw error;
      }
      return this._userRepository.create(user);
    }
  }

  async verifyAccount(userId: string, verificationToken: string) {
    let user: User;
    try {
      user = await this._userRepository.findById(userId);

      const currentDate = getCurrentDate();
      const isTokenCorrect = compareSync(verificationToken, user.verificationToken);
      const isTokenExpired =
        user.verificationTokenExpirationDate && currentDate > user.verificationTokenExpirationDate;

      const ok = !user.isActive && !user.isVerified && isTokenCorrect && !isTokenExpired;

      if (!ok) {
        throw new NotFoundError('Incorrect link');
      }
    } catch (error) {
      throw new NotFoundError('Incorrect link');
    }

    user.isVerified = true;
    user.isActive = true;
    user.verificationToken = null;
    user.verificationTokenExpirationDate = null;

    await this._userRepository.update(user);

    const data = { userId: user._id!, role: user.role };
    const token = await this.createJWT(data);
    return token;
  }

  private async createJWT(data: any /* TODO */): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign({ data }, JWT_SECRET!, { expiresIn: JWT_LIFETIME ?? '6h' });
        resolve(token);
      } catch (error) {
        reject(new InternalServerError('Error while creating token. Please try again'));
      }
    });
  }
}
