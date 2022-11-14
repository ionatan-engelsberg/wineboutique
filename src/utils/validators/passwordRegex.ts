import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { ErrorCodes } from '../../constants/ErrorMessages';

const regex = /([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*/;

export function ContainsLettersAndNumbers(property: string, validationOptions?: ValidationOptions) {
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
    return regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${ErrorCodes.PASSWORD_REGEX}`;
  }
}
