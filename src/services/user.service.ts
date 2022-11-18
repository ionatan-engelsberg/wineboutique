import { Service } from 'typedi';
import uniqid from 'uniqid';

import { ForbiddenError, UnauthorizedError } from '../errors/base.error';

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

  private validateToken(user: User, token: string | null) {
    if (user.accessToken !== token) {
      throw new UnauthorizedError('Private route');
    }
  }

  async findById(userId: ObjectId) {
    return this._userRepository.findById(userId);
  }

  async getUsersWithRole(user: User, token: string) {
    const { role, isActive, isVerified } = user;
    this.validateToken(user, token);

    const validationsOK = isActive && isVerified;

    if (!validationsOK) {
      throw new UnauthorizedError('Private route');
    }

    const filters = { role: { $gte: role, $ne: UserRole.USER } };
    return this._userRepository.findMany(filters);
  }

  async createUser(authUser: User, newUser: User, token: string) {
    this.validateToken(authUser, token);
    if (authUser.role >= newUser.role) {
      throw new ForbiddenError(
        'User can not create other users with roles greater or equal to its own'
      );
    }

    const temporalUserPassword = uniqid();
    newUser.password = temporalUserPassword;

    return this._authService.signup(newUser);
  }
}
