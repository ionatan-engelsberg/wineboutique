import { Service } from 'typedi';
import { Body, HttpCode, JsonController, Post, QueryParams } from 'routing-controllers';

import { AuthAdapter } from '../adapters/Auth.adapter';

import { SignUpDTO, VerifyAccountDTO } from '../dto/Auth.dto';
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
}
