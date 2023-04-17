import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';
import { ErrorMessages } from '../constants/ErrorMessages';

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
      description =
        'Some properties are either missing or incorrect. Check all required values are included and in a correct format';
      details = errors[0];
      details.code = details?.constraints?.code
    }

    // TODO: Send code error to identify it on frontend
    if (error.name === 'MulterError') {
      // TODO: Check more multer errors?
      description = 'There has been an error while uploading requested files';
    }

    // TODO: Copied from Torem
    try {
      res.status(status).json({ message, description: description!, details: details! });
    } catch (err: any) {
      // NOTE: If error happens in webhooks, request has already been sent thus an error is thrown. This try-catch block is therefore necessary
      console.log('WARNING:', err?.message);
      console.log('Originated by:', error);
    }
  }
}
