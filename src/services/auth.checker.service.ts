import { Action } from 'routing-controllers';

import { BadRequestError } from '../errors/base.error';
import { UserJWT, UserRole } from '../types/User.types';

export class AuthorizationCheckerService {
  private static instance: AuthorizationCheckerService;

  private constructor() {}

  public static getInstance(): AuthorizationCheckerService {
    if (!this.instance) {
      this.instance = new AuthorizationCheckerService();
    }
    return this.instance;
  }

  async authorizationChecker(action: Action, roles?: UserRole[]): Promise<boolean> {
    const { request: req } = action;

    const userJWT = req.user as UserJWT;
    if (!userJWT || !roles?.includes(userJWT.role)) {
      throw new BadRequestError(
        'Cannot access this route either because it does not exist or because permissions are missing'
      );
    }

    return true;
  }

  async currentUserChecker(action: Action): Promise<UserJWT> {
    const { request: req } = action;

    const userJWT = req.user as UserJWT;
    if (!userJWT) {
      throw new BadRequestError(
        'Cannot access this route either because it does not exist or because permissions are missing'
      );
    }
    return userJWT;
  }
}
