import { Service } from 'typedi';
import { omit } from 'lodash';

import { AuthService } from '../services/auth.service';

import { User } from '../interfaces';
import {
  ForgotPasswordDTO,
  GetUserToResetPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  SignUpDTO
} from '../dto/Auth.dto';
import { UserRole } from '../types/User.types';

@Service({ transient: true })
export class AuthAdapter {
  constructor(private readonly _authService: AuthService) {}

  async signup(dto: SignUpDTO) {
    const { firstName, lastName, email, birthdate, password, phoneNumber } = dto;

    const user = {
      firstName,
      lastName,
      email,
      birthdate: new Date(Date.now()), // TODO: This isn't done because I can't validate birthdates yet. Once "@IsOlderThan18()" exists in dto/Auth.dto.ts, the birthdate used to create the User must be that one from de DTO.
      password,
      phoneNumber,
      isActive: true,
      role: UserRole.USER
    } as User;

    const { user: newUser, ...cookies } = await this._authService.signup(user);

    const omitFields = [
      'password',
      'role',
      'resetPasswordToken',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt',
      'isActive'
    ];
    return { user: omit(newUser, omitFields), ...cookies };
  }

  async login(dto: LoginDTO) {
    const { email, password } = dto;
    return this._authService.login(email, password);
  }

  async forgotPassword(dto: ForgotPasswordDTO) {
    const { email } = dto;
    return this._authService.forgotPassword(email);
  }

  async getUserToResetPassword(dto: GetUserToResetPasswordDTO) {
    const { q: hashedInfo } = dto;
    await this._authService.getUserToResetPassword(hashedInfo);
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const { q: hashedInfo, password } = dto;
    return this._authService.resetPassword(hashedInfo, password);
  }
}
