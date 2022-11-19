import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';
import { ErrorMessages, ErrorDescriptions, ErrorCodes } from '../constants/ErrorMessages';

// TODO: Check which errors I am using
@Middleware({ type: 'after' })
@Service({ transient: true })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, _next: NextFunction) {
    const { errors } = error;

    const status = error.status ?? error.httpCode ?? HttpStatusCode.INTERNAL_SERVER;
    let message = error.message ?? ErrorMessages.INTERNAL_SERVER;
    let { description } = error;
    let { details } = error;

    // If error is validation error
    // TODO: Better implementation
    if (errors) {
      message = ErrorMessages.BAD_REQUEST;
      if (errors[0].constraints.code) {
        const code = errors[0].constraints.code;
        description = ErrorDescriptions[code];
        details = [{ code }];
      } else {
        description = errors[0];
        details = [{ TODO: 'TODO' }];
      }
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
