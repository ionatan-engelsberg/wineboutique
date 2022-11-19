import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { ErrorCodes } from '../../constants/ErrorMessages';
import { UserRole } from '../../types/User.types';

const validRoles = [UserRole.COFOUNDER, UserRole.ADMIN];

export function ValidNewUserWithRole(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PasswordRegexConstraint
    });
  };
}

@ValidatorConstraint({ name: 'code' })
export class PasswordRegexConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return validRoles.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${ErrorCodes.INVALID_VALUE_ENUM}`;
  }
}
