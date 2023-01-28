import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

import { JWT_LIFETIME, JWT_SECRET, ENV } from '../config/config';
import { InternalServerError, UnauthorizedError } from '../errors/base.error';

import { User } from '../interfaces';
import { getCurrentDate } from '../utils/getCurrentDate';

const MILISECONDS_IN_ONE_MINUTE = 1000 * 60;
const MILISECONDS_IN_ONE_HOUR = MILISECONDS_IN_ONE_MINUTE * 60;

const VERIFY_ACCOUNT_TOKEN_EXPIRATION_TIME = '30d';
const RESET_PASSWORD_TOKEN_VALIDATION_TIME = '15m';
const JWT_VALIDATION_TIME = 6 * MILISECONDS_IN_ONE_HOUR;

@Service({ transient: true })
export class CredentialsService {
  constructor() {}

  private createToken(data: any, secret: string, expirationTime: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign({ data }, secret, { expiresIn: expirationTime });
        resolve(token);
      } catch (error) {
        reject(new InternalServerError('Error while creating token. Please try again'));
      }
    });
  }

  async decodeJWT(token: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        resolve(decoded);
      } catch (error) {
        reject(new UnauthorizedError('Unauthorized'));
      }
    });
  }

  async getJWTData(token: string) {
    const data = await this.decodeJWT(token);

    if (!data || typeof data === 'string') {
      throw new UnauthorizedError('Unauthorized');
    }

    return data;
  }

  async createUserCookies(user: User) {
    const data = { userId: user._id! as string, role: user.role, firstName: user.firstName };

    const token = await this.createToken(data, JWT_SECRET!, JWT_LIFETIME ?? '6h');

    const currentTimestamp = getCurrentDate().getTime();
    const expirationDate = new Date(currentTimestamp + JWT_VALIDATION_TIME);

    const cookieOptions =
      ENV !== 'dev'
        ? {
            httpOnly: true,
            expires: expirationDate,
            secure: true,
            signed: true,
            sameSite: 'Lax'
          }
        : {
            httpOnly: false,
            secure: false,
            expires: expirationDate,
            signed: true
          };

    return { token, cookieOptions };
  }

  hashString(password: string) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  compareHash(inputHash: string, hash: string) {
    return compareSync(inputHash, hash);
  }

  async createVerifyAccountToken(userId: string, verificationToken: string) {
    const data = { userId, verificationToken };
    return this.createToken(data, JWT_SECRET!, VERIFY_ACCOUNT_TOKEN_EXPIRATION_TIME);
  }

  async createResetPasswordToken(userId: string, resetPasswordToken: string) {
    const data = { userId, resetPasswordToken };
    return this.createToken(data, JWT_SECRET!, RESET_PASSWORD_TOKEN_VALIDATION_TIME);
  }
}
