import { Service } from 'typedi';
import {
  Body,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
  QueryParam,
  QueryParams,
  Res
} from 'routing-controllers';

import { AuthAdapter } from '../adapters/auth.adapter';

import {
  ForgotPasswordDTO,
  GetUserToResetPasswordDTO,
  LoginDTO,
  ResetPasswordBody,
  ResetPasswordDTO,
  SignUpDTO
} from '../dto/Auth.dto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@JsonController('/auth')
@Service({ transient: true })
export class AuthController {
  constructor(private readonly _authAdapter: AuthAdapter) {}

  @Post('/signup')
  @HttpCode(HttpStatusCode.CREATED)
  async signup(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: SignUpDTO,
    @Res() res: any
  ) {
    const { user: newUser, token, cookieOptions } = await this._authAdapter.signup(body);
    res.cookie('token', token, { ...cookieOptions });
    return { ...newUser };
  }

  @Post('/login')
  async login(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) dto: LoginDTO,
    @Res() res: any
  ) {
    const { token, cookieOptions, name, userId } = await this._authAdapter.login(dto);
    res.cookie('token', token, { ...cookieOptions });
    return { name, userId };
  }

  // TODO
  @Post('/logout')
  @OnUndefined(HttpStatusCode.OK)
  logout(@Res() res: any) {
    res.clearCookie('token');
  }

  @Post('/forgot_password')
  @OnUndefined(HttpStatusCode.OK)
  async forgotPassword(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) dto: ForgotPasswordDTO
  ) {
    await this._authAdapter.forgotPassword(dto);
  }

  @Get('/forgot_password')
  @OnUndefined(HttpStatusCode.OK)
  async getUserToResetPassword(@QueryParams() dto: GetUserToResetPasswordDTO) {
    await this._authAdapter.getUserToResetPassword(dto);
  }

  @Post('/reset_password')
  @OnUndefined(HttpStatusCode.OK)
  async resetPassword(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: ResetPasswordBody,
    @QueryParam('q') q: string
  ) {
    const dto: ResetPasswordDTO = { ...body, q };
    await this._authAdapter.resetPassword(dto);
  }
}
