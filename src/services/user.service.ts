import { Service } from 'typedi';

import { UnauthorizedError } from '../errors/base.error';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../interfaces';
import { ObjectId } from '../types/ObjectId';
import { UserRole } from '../types/User.types';

@Service({ transient: true })
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  async findById(userId: ObjectId) {
    return this._userRepository.findById(userId);
  }

  async getUsersWithRole(user: User, token: string) {
    const { role, isActive, isVerified, accessToken } = user;

    const validationsOK = isActive && isVerified && accessToken === token && role !== UserRole.USER;

    if (!validationsOK) {
      throw new UnauthorizedError('Private route');
    }

    const filters = { role: { $gte: role, $ne: UserRole.USER } };
    return this._userRepository.findMany(filters);
  }
}
