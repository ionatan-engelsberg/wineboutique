import { Service } from 'typedi';
import {
  Body,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
  QueryParams
} from 'routing-controllers';

import { AuthAdapter } from '../adapters/Auth.adapter';

import {
  ForgotPasswordDTO,
  GetUserToResetPasswordDTO,
  LoginDTO,
  SignUpDTO,
  VerifyAccountDTO
} from '../dto/Auth.dto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@JsonController('/auth')
@Service({ transient: true })
export class AuthController {
  constructor(private readonly _authAdapter: AuthAdapter) {}

  @Post('/signup')
  @HttpCode(HttpStatusCode.CREATED)
  async signup(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: SignUpDTO
  ) {
    return this._authAdapter.signup(body);
  }

  @Post('/verify_account')
  async verifyAccount(@QueryParams() dto: VerifyAccountDTO) {
    return this._authAdapter.verifyAccount(dto);
  }

  @Post('/login')
  async login(@Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) dto: LoginDTO) {
    return this._authAdapter.login(dto);
  }

  @Post('/forgot_password')
  @OnUndefined(200)
  async forgotPassword(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) dto: ForgotPasswordDTO
  ) {
    await this._authAdapter.forgotPassword(dto);
  }

  @Get('/forgot_password')
  @OnUndefined(200)
  async getUserToResetPassword(@QueryParams() dto: GetUserToResetPasswordDTO) {
    await this._authAdapter.getUserToResetPassword(dto);
  }
}
