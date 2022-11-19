import { Service } from 'typedi';
import { omit } from 'lodash';

import { UserService } from '../services/user.service';

import {
  CreateUserWithRoleDTO,
  DeleteUserDTO,
  GetUsersWithRoleDTO,
  UpdateUserDTO
} from '../dto/User.dto';
import { User } from '../interfaces';
import { UserRole } from '../types/User.types';

@Service({ transient: true })
export class UserAdapter {
  constructor(private readonly _userService: UserService) {}

  async getUsersWithRole(dto: GetUsersWithRoleDTO) {
    const { userId } = dto;

    const user = await this._userService.findById(userId);
    const users = await this._userService.getUsersWithRole(user);

    const omitFields = [
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
    const { firstName, lastName, email, birthdate, phoneNumber, role, userId } = dto;

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

    const createdUser = await this._userService.createUser(user, newUser);

    const omitFields = [
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

  async updateUser(dto: UpdateUserDTO) {
    const { firstName, lastName, email, birthdate, role, userId, user } = dto;

    const oldUser = await this._userService.findById(userId);
    const userAction =
      user.userId === userId ? oldUser : await this._userService.findById(user.userId);
    const newUser = {
      _id: oldUser._id,
      firstName,
      lastName,
      email,
      birthdate: new Date(Date.now()), // TODO
      role,
      userId,
      password: oldUser.password,
      isVerified: oldUser.isVerified,
      isActive: oldUser.isActive
    } as User;

    const updatedUser = await this._userService.updateUser(userAction, oldUser, newUser);

    const omitFields = [
      'password',
      'verificationToken',
      'resetPasswordToken',
      'verificationTokenExpirationDate',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt'
    ];
    return omit(updatedUser, omitFields);
  }

  async deleteUser(dto: DeleteUserDTO) {
    const { userId, user } = dto;

    const userToDelete = await this._userService.findById(userId);
    const userAction =
      user.userId === userId ? userToDelete : await this._userService.findById(user.userId);

    await this._userService.deleteUser(userAction, userToDelete);
  }
}
