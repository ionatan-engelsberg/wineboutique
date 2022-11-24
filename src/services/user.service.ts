import { Service } from 'typedi';
import uniqid from 'uniqid';
import { isEqual } from 'lodash';

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
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

    return this._userRepository.findMany(filters, sort);
  }

  getUserById(user: User, userToGet: User) {
    if (user._id !== userToGet._id) {
      this.validateGetOtherUser(user, userToGet);
    }

    return userToGet;
  }

  private validateGetOtherUser(user: User, userToGet: User) {
    if (user.role >= userToGet.role || userToGet.role === UserRole.USER) {
      throw new NotFoundError(`User with id ${userToGet._id} does not exist`);
    }
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
    if (user.role >= userToUpdate.role) {
      throw new NotFoundError(`User with id ${userToUpdate._id} does not exist`);
    }
    if (userToUpdate.role === UserRole.USER) {
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

    if (!oldUser.isActive) {
      throw new NotFoundError(`User with id ${oldUser._id} does not exist`);
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

  async deleteUser(user: User, userToDelete: User) {
    if (user._id !== userToDelete._id) {
      return this.deleteOtherUser(user, userToDelete);
    }

    if (!userToDelete.isActive) {
      throw new NotFoundError(`User with id ${userToDelete._id} does not exist`);
    }

    if (userToDelete.role !== UserRole.USER) {
      throw new ForbiddenError('This user can not delete its own account');
    }

    userToDelete.isActive = false;
    await this._userRepository.update(userToDelete);
  }

  private async deleteOtherUser(user: User, userToDelete: User) {
    if (user.role >= userToDelete.role) {
      throw new NotFoundError(`User with id ${userToDelete._id} does not exist`);
    }
    if (userToDelete.role === UserRole.USER) {
      throw new ForbiddenError('Cannot delete the requested user');
    }

    await this._userRepository.deleteById(userToDelete._id!);
  }

  async updateUserPassword(user: User, userId: string, password: string) {
    if (!user.isActive || user._id !== userId) {
      throw new NotFoundError(`User with id ${user._id} does not exist`);
    }

    if (user.password === password) {
      return;
    }

    user.password = this._credentialsService.hashString(password);
    await this._userRepository.update(user);
  }

  getCurrentUser(userJWT?: UserJWT) {
    if (!userJWT) {
      throw new UnauthorizedError('Private route');
    }

    const { firstName } = userJWT;
    return { firstName };
  }
}
