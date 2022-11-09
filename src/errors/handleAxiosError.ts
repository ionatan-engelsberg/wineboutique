import { BaseError } from './base.error';
import { ErrorMessages } from '../constants/ErrorMessages';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

export const handleAxiosError = (error: any) => {
  let message = ErrorMessages.INTERNAL_SERVER;
  let status = HttpStatusCode.INTERNAL_SERVER;

  if (error.isAxiosError) {
    message = error?.response?.data?.error?.message ?? error.message;
    status = error?.response?.status ?? HttpStatusCode.INTERNAL_SERVER;
  }

  throw new BaseError(message, status);
};
