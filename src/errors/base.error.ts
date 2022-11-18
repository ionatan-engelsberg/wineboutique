import { HttpStatusCode } from '../constants/HttpStatusCodes';
import { ErrorMessages } from '../constants/ErrorMessages';

export class BaseError extends Error {
  public readonly status: HttpStatusCode;

  public readonly description?: string;

  public readonly details?: any[];

  constructor(message: string, status: HttpStatusCode, description?: string, details?: any[]) {
    super(message);
    this.status = status ?? HttpStatusCode.INTERNAL_SERVER;
    this.description = description;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(description: string, details?: any) {
    super(ErrorMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, description, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(description: string, details?: any) {
    super(ErrorMessages.NOT_FOUND, HttpStatusCode.NOT_FOUND, description, details);
  }
}

export class ConflictError extends BaseError {
  constructor(description: string, details?: any) {
    super(ErrorMessages.CONFLICT, HttpStatusCode.CONFLICT, description, details);
  }
}

export class ForbiddenError extends BaseError {
  constructor(description: string, details?: any) {
    super(ErrorMessages.FORBIDDEN, HttpStatusCode.FORBIDDEN, description, details);
  }
}

export class BadRequestError extends BaseError {
  constructor(description: string, details?: any) {
    super(ErrorMessages.BAD_REQUEST, HttpStatusCode.BAD_REQUEST, description, details);
  }
}

export class IncorrectFormatError extends BaseError {
  constructor(description: string, details?: any) {
    super(ErrorMessages.INCORRECT_FORMAT, HttpStatusCode.BAD_REQUEST, description, details);
  }
}

export class InternalServerError extends BaseError {
  constructor(description?: string, details?: any) {
    super(ErrorMessages.INTERNAL_SERVER, HttpStatusCode.INTERNAL_SERVER, description, details);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, description?: string) {
    super(message, HttpStatusCode.INTERNAL_SERVER, description);
  }
}
