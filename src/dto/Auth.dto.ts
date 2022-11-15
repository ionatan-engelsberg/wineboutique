import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

import { Match } from '../utils/validators/passwordsAreEqual';
import { ContainsLettersAndNumbers } from '../utils/validators/passwordRegex';

export class SignUpDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName!: string;

  @IsEmail()
  email!: string;

  // TODO: min 18yr old
  @IsString()
  // @IsDate()
  // @IsOlderThan18('birthdate')
  birthdate!: Date;

  @IsString()
  @ContainsLettersAndNumbers('password')
  password!: string;

  @IsString()
  @Match('password')
  checkPassword!: string;

  @IsOptional()
  @IsPhoneNumber('AR')
  phoneNumber?: number;
}

export class VerifyAccountDTO {
  @IsOptional()
  id!: string;

  @IsOptional()
  token!: string;
}
