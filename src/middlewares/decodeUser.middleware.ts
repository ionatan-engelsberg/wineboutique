import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

import { UserJWT } from '../types/User.types';
import { CredentialsService } from '../services/credentials.service';
import { logErrors } from '../utils/logger';

@Service({ transient: true })
@Middleware({ type: 'before' })
export class DecodeUser implements ExpressMiddlewareInterface {
  constructor(private readonly _credentialsService: CredentialsService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.signedCookies;

      const decoded = await this._credentialsService.decodeJWT(token);
      if (!decoded || typeof decoded === 'string') {
        return;
      }

      const { userId, role } = decoded.data;
      req.user = { userId, role } as UserJWT;
    } catch (error) {
      console.log('WARNING: Error while decoding token:', error);
      await logErrors(error);
    } finally {
      next();
    }
  }
}
