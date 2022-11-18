import { Service } from 'typedi';

import { UserRepository } from '../repositories/user.repository';

import { ObjectId } from '../types/ObjectId';

@Service({ transient: true })
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  async findById(userId: ObjectId) {
    return this._userRepository.findById(userId);
  }
}
