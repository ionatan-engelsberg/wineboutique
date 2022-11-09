import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';
import { ErrorMessages } from '../constants/ErrorMessages';

@Middleware({ type: 'after' })
@Service({ transient: true })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, _next: NextFunction) {
    const { errors } = error;

    const status = error.status ?? error.httpCode ?? HttpStatusCode.INTERNAL_SERVER;
    const message = error.message ?? ErrorMessages.INTERNAL_SERVER;
    let { description } = error;
    let { details } = error;

    // If error is validation error
    if (errors) {
      description =
        'Some properties are either missing or incorrect. Check all required values are included and in a correct format';
      details = errors[0];
    }

    if (error.name === 'MulterError') {
      // TODO: Check more multer errors?
      description = 'There has been an error while uploading requested files';
    }

    try {
      res.status(status).json({ message, description: description!, details: details! });
    } catch (err: any) {
      // NOTE: If error happens in webhooks, request has already been sent thus an error is thrown. This try-catch block is therefore necessary
      console.log('WARNING:', err?.message);
      console.log('Originated by:', error);
    }
  }
}
