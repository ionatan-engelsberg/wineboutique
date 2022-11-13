import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import trimRequest from 'trim-request';

@Middleware({ type: 'before' })
@Service({ transient: true })
export class TrimRequest implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    trimRequest.all(req, res, next);
  }
}
