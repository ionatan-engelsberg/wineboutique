import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { ErrorCodes } from '../../constants/ErrorMessages';
import { getCurrentDate } from '../getCurrentDate';

export function IsOlderThan18(property: string, validationOptions?: ValidationOptions) {
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
  // TODO: Finish
  validate(birthdate: Date, args: ValidationArguments) {
    const currentDate = getCurrentDate();

    const currentYear = currentDate.getFullYear();
    const birthdateYear = birthdate.getFullYear();

    const currentMonth = currentDate.getMonth();
    const birthdateMonth = birthdate.getMonth();

    const currentDay = currentDate.getDate();
    const birthdateDay = birthdate.getDate();

    const birthdateAlreadyPassed =
      currentMonth > birthdateMonth ||
      (currentMonth === birthdateMonth && currentDay >= birthdateDay);

    return (
      currentYear - birthdateYear > 18 ||
      (currentYear - birthdateYear === 18 && birthdateAlreadyPassed)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${ErrorCodes.OLDER_THAN_18}`;
  }
}
