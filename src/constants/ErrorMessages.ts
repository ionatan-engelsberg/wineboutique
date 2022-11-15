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

export const ErrorDescriptions = {
  0: 'Password must contain at least one letter and one number',
  1: 'password and checkPassword do not match',
  2: 'User must be older than 18 yr old to register'
};

export enum ErrorCodes {
  PASSWORD_REGEX,
  EQUAL_PASSWORD,
  BIGGER_THAN_18
}
