import { Service } from 'typedi';
import { CurrentUser, Get, JsonController } from 'routing-controllers';

import { UserAdapter } from '../adapters/user.adapter';

import { GetUsersWithRoleDTO } from '../dto/User.dto';
import { UserJWT } from '../types/User.types';

@JsonController('/users')
@Service({ transient: true })
export class UserController {
  constructor(private readonly _userAdapter: UserAdapter) {}

  @Get()
  async getUsersWithRole(@CurrentUser() userJWT: UserJWT) {
    const { userId, role, accessToken } = userJWT;
    const dto: GetUsersWithRoleDTO = { userId, role, accessToken: accessToken as string };
    return this._userAdapter.getUsersWithRole(dto);
  }
}
