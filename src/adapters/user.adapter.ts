import { Service } from 'typedi';
import { omit } from 'lodash';

import { UserService } from '../services/user.service';

import { GetUsersWithRoleDTO } from '../dto/User.dto';
import { User } from '../interfaces';

@Service({ transient: true })
export class UserAdapter {
  constructor(private readonly _userService: UserService) {}

  async getUsersWithRole(dto: GetUsersWithRoleDTO) {
    const { userId, accessToken } = dto;

    const user = await this._userService.findById(userId);
    const users = await this._userService.getUsersWithRole(user, accessToken);

    const omitFields = [
      'accessToken',
      'password',
      'verificationToken',
      'resetPasswordToken',
      'verificationTokenExpirationDate',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt'
    ];

    return users.map((u: User) => omit(u, omitFields));
  }
}
