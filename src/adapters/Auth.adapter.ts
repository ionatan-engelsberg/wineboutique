import { Service } from 'typedi';
import { omit } from 'lodash';

import { AuthService } from '../services/auth.service';

import { User } from '../interfaces';
import { ForgotPasswordDTO, LoginDTO, SignUpDTO, VerifyAccountDTO } from '../dto/Auth.dto';
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
      birthdate: new Date(Date.now()), // TODO
      password,
      phoneNumber,
      isVerified: false,
      isActive: false,
      role: UserRole.USER
    } as User;

    const newUser = await this._authService.signup(user);

    const omitFields = [
      'accessToken',
      'password',
      'verificationToken',
      'resetPasswordToken',
      'role',
      'verificationTokenExpirationDate',
      'resetPasswordTokenExpirationDate',
      'createdAt',
      'updatedAt'
    ];
    return omit(newUser, omitFields);
  }

  async verifyAccount(dto: VerifyAccountDTO) {
    const { q: hashedInfo } = dto;
    return this._authService.verifyAccount(hashedInfo);
  }

  async login(dto: LoginDTO) {
    const { email, password } = dto;
    return this._authService.login(email, password);
  }

  async forgotPassword(dto: ForgotPasswordDTO) {
    const { email } = dto;
    return this._authService.forgotPassword(email);
  }
}
