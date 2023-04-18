export enum ErrorMessages {
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = '404 Not Found',
  BAD_REQUEST = 'Bad request',
  INCORRECT_FORMAT = 'Incorrect format',
  INTERNAL_SERVER = 'Internal server error',
  FORBIDDEN = 'Forbidden',
  CONFLICT = 'The request could not be processed due to a conflict'
}

export enum DatabaseErrorMessages {
  NON_EXISTING_ENTITY = 'Requested entity does not exist',
  COULD_NOT_SAVE = 'Could not save requested entity. Please try again'
}

export enum ErrorCodes {
  PASSWORD_REGEX,
  EQUAL_PASSWORD,
  OLDER_THAN_18,
  INVALID_VALUE_ENUM,
  INVALID_MIMETYPE,
  MAX_SIZE_EXCEEDED
}
