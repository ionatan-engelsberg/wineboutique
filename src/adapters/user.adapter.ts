import { Service } from 'typedi';
import { omit } from 'lodash';

import { UserService } from '../services/user.service';

import {
  CreateUserWithRoleDTO,
  DeleteUserDTO,
  GetCurrentUserDTO,
  GetUserByIdDTO,
  GetUsersWithRoleDTO,
  UpdateUserDTO,
  UpdateUserPasswordDTO
} from '../dto/User.dto';
import { User } from '../interfaces';

@Service({ transient: true })
export class UserAdapter {
  constructor(private readonly _userService: UserService) {}

  async getUsersWithRole(dto: GetUsersWithRoleDTO) {
    const { userId } = dto;

    const user = await this._userService.findById(userId);
    const users = await this._userService.getUsersWithRole(user);

    const omitFields = [
      'password',
      'resetPasswordToken',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt'
    ];

    return users.map((u: User) => omit(u, omitFields));
  }

  async getUserById(dto: GetUserByIdDTO) {
    const { userId, userJWT } = dto;

    const userToGet = await this._userService.findById(userId);
    const userAction =
      userJWT.userId === userId ? userToGet : await this._userService.findById(userJWT.userId);

    const user = this._userService.getUserById(userAction, userToGet);

    const omitFields = [
      'password',
      'resetPasswordToken',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt',
      'role' // TODO: Depending on the role of the user making the request (service)
    ];
    return omit(user, omitFields);
  }

  async createUserWithRole(dto: CreateUserWithRoleDTO) {
    const { firstName, lastName, email, birthdate, phoneNumber, role, userJWT } = dto;

    const newUser = {
      firstName,
      lastName,
      email,
      birthdate,
      phoneNumber,
      role,
      password: '',
      isActive: false
    } as User;

    const user = await this._userService.findById(userJWT.userId);

    const createdUser = await this._userService.createUser(user, newUser);

    const omitFields = [
      'password',
      'resetPasswordToken',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt'
    ];
    return omit(createdUser, omitFields);
  }

  async updateUser(dto: UpdateUserDTO) {
    const { firstName, lastName, email, birthdate, role, userId, userJWT } = dto;

    const oldUser = await this._userService.findById(userId);
    const user =
      userJWT.userId === userId ? oldUser : await this._userService.findById(userJWT.userId);
    const newUser = {
      _id: oldUser._id,
      firstName,
      lastName,
      email,
      birthdate: new Date(Date.now()), // TODO
      role: role ?? oldUser.role /* TODO */,
      userId,
      password: oldUser.password,
      isActive: oldUser.isActive
    } as User;

    const updatedUser = await this._userService.updateUser(user, oldUser, newUser);

    const omitFields = [
      'password',
      'resetPasswordToken',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt'
    ];
    return omit(updatedUser, omitFields);
  }

  async deleteUser(dto: DeleteUserDTO) {
    const { userId, userJWT } = dto;

    const userToDelete = await this._userService.findById(userId);
    const user =
      userJWT.userId === userId ? userToDelete : await this._userService.findById(userJWT.userId);

    await this._userService.deleteUser(user, userToDelete);
  }

  async updateUserPassword(dto: UpdateUserPasswordDTO) {
    const { oldPassword, password, userJWT, userId } = dto;

    const user = await this._userService.findById(userJWT.userId);

    await this._userService.updateUserPassword(user, userId, oldPassword, password);
  }

  getCurrentUser(dto: GetCurrentUserDTO) {
    const { userJWT } = dto;
    return this._userService.getCurrentUser(userJWT);
  }
}
