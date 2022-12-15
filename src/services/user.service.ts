import { Service } from 'typedi';
import uniqid from 'uniqid';
import { isEqual, omit } from 'lodash';

import {
  ConflictError,
  ForbiddenError,
  IncorrectFormatError,
  NotFoundError,
  UnauthorizedError
} from '../errors/base.error';

import { AuthService } from './auth.service';
import { CredentialsService } from './credentials.service';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../interfaces';
import { ObjectId } from '../types/ObjectId';
import { UserJWT, UserRole } from '../types/User.types';

@Service({ transient: true })
export class UserService {
  constructor(
    private readonly _authService: AuthService,
    private readonly _credentialsService: CredentialsService,

    private readonly _userRepository: UserRepository
  ) {}

  async findById(userId: ObjectId) {
    return this._userRepository.findById(userId);
  }

  async getUsersWithRole(user: User) {
    const { role, isActive } = user;

    if (!isActive) {
      throw new UnauthorizedError('Private route');
    }

    const filters = { role: { $gte: role, $ne: UserRole.USER } };
    const sort = { role: 1 };
    const options = { sort };

    return this._userRepository.findMany(filters, options);
  }

  async getUserById(userJWT: UserJWT, userId: ObjectId) {
    if (userJWT.userId !== userId && userJWT.role === UserRole.USER) {
      throw new UnauthorizedError('Unauthorized');
    }

    const requestingUser = await this._userRepository.findById(userJWT.userId);

    if (userJWT.userId === userId) {
      const omitFields = requestingUser.role === UserRole.USER ? ['role'] : [];
      return omit(requestingUser, omitFields);
    }

    const user = await this._userRepository.findById(userId);
    if (requestingUser.role >= user.role || user.role === UserRole.USER) {
      throw new NotFoundError(`User with id ${user._id} does not exist`);
    }

    return user;
  }

  async createUser(authUser: User, newUser: User) {
    if (authUser.role >= newUser.role) {
      throw new ForbiddenError(
        'User can not create other users with roles greater or equal to its own'
      );
    }

    const temporalUserPassword = uniqid();
    newUser.password = temporalUserPassword;

    return this._authService.signup(newUser);
  }

  async updateUser(userJWT: UserJWT, oldUser: User, newUser: User) {
    if (!oldUser.isActive) {
      throw new NotFoundError(`User with id ${oldUser._id} does not exist`);
    }

    if (userJWT.userId !== oldUser._id) {
      this.validateUpdateOtherUserWithRole(userJWT, oldUser, newUser);
    } else {
      this.validateUpdateUser(oldUser, newUser);
    }
    await this.validateUserWithSameEmail(oldUser, newUser);

    const omitFields = userJWT.role === UserRole.USER ? ['role'] : [];

    if (isEqual(oldUser, newUser)) {
      return omit(oldUser, omitFields);
    }

    const updatedUser = await this._userRepository.update(newUser);
    return omit(updatedUser, omitFields);
  }

  private validateUpdateOtherUserWithRole(userJWT: UserJWT, oldUser: User, newUser: User) {
    if (userJWT.role >= oldUser.role) {
      throw new NotFoundError(`User with id ${oldUser._id} does not exist`);
    }
    if (oldUser.role === UserRole.USER) {
      throw new ForbiddenError('Cannot update the requested user');
    }
    if (newUser.role <= userJWT.role) {
      throw new ForbiddenError('Can not assign to a user a role equal or higher than its own');
    }
  }

  private validateUpdateUser(oldUser: User, newUser: User) {
    if (oldUser.role !== newUser.role) {
      if (oldUser.role === UserRole.USER) {
        throw new IncorrectFormatError('Incorrect parameter "role"');
      }

      throw new ForbiddenError('User can not update its own role');
    }
  }

  private async validateUserWithSameEmail(oldUser: User, newUser: User) {
    let existingUser: User;
    try {
      const { email } = newUser;
      existingUser = await this._userRepository.findOne({ email });

      const { isActive, _id: userId } = existingUser;
      if (isActive) {
        throw new ConflictError(`User with email ${email} already exists`, [{ userId }]);
      }

      await this.updateUnactiveExistingUserEmail(existingUser);
    } catch (error: any) {
      if (error.details && error.details[0].userId !== oldUser._id) {
        throw error;
      }
    }
  }

  private async updateUnactiveExistingUserEmail(user: User) {
    const uniqId = uniqid();
    const ficticiuosEmail = `${uniqId}@gmail.com`;
    user.email = ficticiuosEmail;
    await this._userRepository.update(user);
  }

  async deleteUser(userJWT: UserJWT, userId: ObjectId) {
    const user = await this._userRepository.findById(userId);

    if (userJWT.userId !== userId) {
      return this.deleteOtherUser(userJWT, user);
    }

    if (!user.isActive) {
      throw new NotFoundError(`User with id ${user._id} does not exist`);
    }

    if (user.role !== UserRole.USER) {
      throw new ForbiddenError('This user can not delete its own account');
    }

    user.isActive = false;
    await this._userRepository.update(user);
  }

  private async deleteOtherUser(userJWT: UserJWT, userToDelete: User) {
    if (userJWT.role === UserRole.USER || userToDelete.role === UserRole.USER) {
      throw new ForbiddenError('Cannot delete the requested user');
    }

    if (userJWT.role >= userToDelete.role) {
      throw new NotFoundError(`User with id ${userToDelete._id} does not exist`);
    }

    await this._userRepository.deleteById(userToDelete._id!);
  }

  async updateUserPassword(user: User, userId: string, oldPassword: string, newPassword: string) {
    if (!user.isActive || user._id !== userId) {
      throw new NotFoundError(`User with id ${user._id} does not exist`);
    }

    const isOldPasswordCorrect = this._credentialsService.compareHash(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      throw new UnauthorizedError('Incorrect password');
    }

    if (user.password === newPassword) {
      return;
    }

    user.password = this._credentialsService.hashString(newPassword);
    await this._userRepository.update(user);
  }

  getCurrentUser(userJWT?: UserJWT) {
    if (!userJWT) {
      return null;
    }

    const { firstName, userId, role } = userJWT;
    const isAuthorized = role !== UserRole.USER;

    return { firstName, userId, isAuthorized };
  }
}
