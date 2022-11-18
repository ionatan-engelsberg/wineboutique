// import Container from 'typedi';
import { Action } from 'routing-controllers';

import { NotFoundError } from '../errors/base.error';
import { UserJWT } from '../types/User.types';

export class AuthorizationCheckerService {
  private static instance: AuthorizationCheckerService;

  private constructor() {}

  public static getInstance(): AuthorizationCheckerService {
    if (!this.instance) {
      this.instance = new AuthorizationCheckerService();
    }
    return this.instance;
  }

  async authorizationChecker(action: Action, permissions?: any[]): Promise<boolean> {
    const { request: req } = action;

    const userJWT = req.user as UserJWT;
    if (!userJWT) {
      throw new NotFoundError(
        'Cannot access this route either because it does not exist or permissions are missing'
      );
    }

    // TODO: Check permissions for specific endpoints
    // const { user, account } = authUser;
    // Container.get(RoleService).checkPermissions(account, user, permissions);
    return true;
  }

  async currentUserChecker(action: Action): Promise<UserJWT> {
    const { request: req } = action;

    const userJWT = req.user as UserJWT;
    if (!userJWT) {
      throw new NotFoundError(
        'Cannot access this route either because it does not exist or permissions are missing'
      );
    }
    return userJWT;
  }
}
