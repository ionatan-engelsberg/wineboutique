import { Service } from 'typedi';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put
} from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { UserAdapter } from '../adapters/user.adapter';

import {
  CreateUserWithRoleBody,
  CreateUserWithRoleDTO,
  GetUsersWithRoleDTO,
  UpdateUserBody,
  UpdateUserDTO
} from '../dto/User.dto';
import { UserJWT, UserRole } from '../types/User.types';

@JsonController('/users')
@Service({ transient: true })
export class UserController {
  constructor(private readonly _userAdapter: UserAdapter) {}

  @Authorized([UserRole.ADMIN, UserRole.COFOUNDER, UserRole.OWNER])
  @Get()
  async getUsersWithRole(@CurrentUser() userJWT: UserJWT) {
    const { userId, role } = userJWT;
    const dto: GetUsersWithRoleDTO = { userId, role };
    return this._userAdapter.getUsersWithRole(dto);
  }

  @Authorized([UserRole.OWNER, UserRole.COFOUNDER])
  @Post()
  async createUserWithRole(
    @CurrentUser() userJWT: UserJWT,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    body: CreateUserWithRoleBody
  ) {
    const { userId, role } = userJWT;
    const dto: CreateUserWithRoleDTO = { userId, userRole: role, ...body };
    return this._userAdapter.createUserWithRole(dto);
  }

  @Put('/:userId')
  @OnUndefined(HttpStatusCode.NO_CONTENT)
  async updateUser(
    @CurrentUser() userJWT: UserJWT,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: UpdateUserBody,
    @Param('userId') userId: string
  ) {
    const dto: UpdateUserDTO = { ...body, userId, user: userJWT };
    await this._userAdapter.updateUser(dto);
  }
}
