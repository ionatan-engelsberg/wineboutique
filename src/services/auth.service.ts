import { Service } from 'typedi';
import { hashSync, genSaltSync } from 'bcrypt';
import { randomBytes } from 'crypto';

import { ConflictError } from '../errors/base.error';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../interfaces';
import { getCurrentDate } from '../utils/getCurrentDate';

const MILISECONDS_IN_ONE_HOUR = 1000 * 60 * 60;
const MILISECONDS_IN_ONE_DAY = MILISECONDS_IN_ONE_HOUR * 24;

@Service({ transient: true })
export class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  async signup(user: User) {
    user.password = this.hashPassword(user.password);
    user.verificationToken = randomBytes(40).toString('hex');

    const currentDate = getCurrentDate().getTime();
    const verificationTokenExpirationTimestamp = currentDate + MILISECONDS_IN_ONE_HOUR;
    const verificationTokenExpirationDate = new Date(verificationTokenExpirationTimestamp);
    user.verificationTokenExpirationDate = verificationTokenExpirationDate;

    user = await this.createUser(user);
  }

  private hashPassword(password: string) {
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

      if (currentDate - verificationTokenExpirationTimestamp < 5 * MILISECONDS_IN_ONE_DAY) {
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
}
