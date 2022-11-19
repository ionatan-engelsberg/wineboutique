import { Service } from 'typedi';
import uniqid from 'uniqid';
import { isEqual } from 'lodash';

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  IncorrectFormatError,
  NotFoundError,
  UnauthorizedError
} from '../errors/base.error';

import { AuthService } from './auth.service';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../interfaces';
import { ObjectId } from '../types/ObjectId';
import { UserRole } from '../types/User.types';

@Service({ transient: true })
export class UserService {
  constructor(
    private readonly _authService: AuthService,

    private readonly _userRepository: UserRepository
  ) {}

  async findById(userId: ObjectId) {
    return this._userRepository.findById(userId);
  }

  async getUsersWithRole(user: User) {
    const { role, isActive, isVerified } = user;

    const validationsOK = isActive && isVerified;

    if (!validationsOK) {
      throw new UnauthorizedError('Private route');
    }

    const filters = { role: { $gte: role, $ne: UserRole.USER } };
    const sort = { role: 1 };

    return this._userRepository.findMany(filters, sort);
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

  async updateUser(user: User, userToUpdate: User, newUser: User) {
    if (!userToUpdate.isActive) {
      throw new NotFoundError(`User with id ${user._id} does not exist`);
    }

    if (user._id !== userToUpdate._id) {
      this.validateUpdateOtherUserWithRole(user, userToUpdate, newUser);
    } else {
      this.validateUpdateUser(userToUpdate, newUser);
    }
    await this.validateUserWithSameEmail(userToUpdate, newUser);

    if (isEqual(userToUpdate, newUser)) {
      return userToUpdate;
    }

    return this._userRepository.update(newUser);
  }

  private validateUpdateOtherUserWithRole(user: User, userToUpdate: User, newUser: User) {
    if (userToUpdate.role === UserRole.USER || user.role >= userToUpdate.role) {
      throw new ForbiddenError('Cannot update the requested user');
    }
    if (newUser.role <= user.role) {
      throw new BadRequestError('Can not assign to a user a role equal or higher than its own');
    }
  }

  private validateUpdateUser(oldUser: User, newUser: User) {
    if (oldUser.role !== newUser.role) {
      throw new ForbiddenError('User can not update its own role');
    }
  }

  private async validateUserWithSameEmail(oldUser: User, newUser: User) {
    let existingUser: User;
    try {
      const { email } = newUser;
      existingUser = await this._userRepository.findOne({ email });

      this._authService.validateExistingUser(existingUser);
      await this.updateExistingUserEmail(existingUser);
    } catch (error: any) {
      if (error.details && error.details[0].userId !== oldUser._id) {
        throw error;
      }
    }
  }

  private async updateExistingUserEmail(user: User) {
    const uniqId = uniqid();
    const ficticiuosEmail = `${uniqId}@gmail.com`;
    user.email = ficticiuosEmail;
    await this._userRepository.update(user);
  }
}
