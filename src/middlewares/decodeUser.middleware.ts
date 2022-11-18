import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

import { UserJWT } from '../types/User.types';
import { CredentialsService } from '../services/credentials.service';
import { UserService } from '../services/user.service';

@Service({ transient: true })
@Middleware({ type: 'before' })
export class DecodeUser implements ExpressMiddlewareInterface {
  constructor(
    private readonly _credentialsService: CredentialsService,
    private readonly _userService: UserService
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.signedCookies;

      const decoded = await this._credentialsService.decodeJWT(token);
      if (!decoded || typeof decoded === 'string') {
        return;
      }

      const user = await this._userService.findById(decoded.data.user);
      const { _id: userId, role } = user;

      req.user = { userId, role } as UserJWT;
    } catch (error) {
      // Logger
      console.log('WARNING: Error while decoding token:', error);
    } finally {
      next();
    }
  }
}
