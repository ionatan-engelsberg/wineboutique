import { Service } from 'typedi';
import { omit } from 'lodash';

import { UserService } from '../services/user.service';

import { CreateUserWithRoleDTO, GetUsersWithRoleDTO } from '../dto/User.dto';
import { User } from '../interfaces';
import { UserRole } from '../types/User.types';

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

  async createUserWithRole(dto: CreateUserWithRoleDTO) {
    const { firstName, lastName, email, birthdate, phoneNumber, role, userId, accessToken } = dto;

    const newUser = {
      firstName,
      lastName,
      email,
      birthdate,
      phoneNumber,
      role,
      password: '',
      isVerified: false,
      isActive: false
    } as User;

    const user = await this._userService.findById(userId);

    const createdUser = await this._userService.createUser(user, newUser, accessToken!);

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
    return omit(createdUser, omitFields);
  }
}
