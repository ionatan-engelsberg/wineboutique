import { Error } from 'mongoose';

import { ConflictError, IncorrectFormatError } from './base.error';

const DUPLICATE_VALUE_ERROR_CODE = 11000;

export const handleMongoError = (error: any) => {
  let description: string;
  let details: any;

  if (error.code === DUPLICATE_VALUE_ERROR_CODE) {
    description = 'Duplicate key value';
    details = [error.keyValue];
    throw new ConflictError(description, details);
  }

  if (error instanceof Error.CastError) {
    console.log('WARNING: Cast Error ocurred');
  }

  if (error instanceof Error.ValidationError) {
    description = error.message;
    throw new IncorrectFormatError(description);
  }
};
