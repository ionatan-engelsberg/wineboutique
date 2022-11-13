import { Service } from 'typedi';

import { BaseRepository } from './repository';

import { UserModel } from '../database/User';
import { User } from '../interfaces';

@Service({ transient: true })
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }
}
