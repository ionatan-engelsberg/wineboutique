import { IsDate, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { Match, ContainsLettersAndNumbers, IsOlderThan18 } from '../utils/validators';

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

  @Transform((value) => new Date(value))
  @IsDate()
  @IsOlderThan18('birthdate')
  birthdate!: Date;

  @IsString()
  @ContainsLettersAndNumbers('password')
  @MinLength(8)
  @MaxLength(50)
  password!: string;

  @IsString()
  @Match('password')
  checkPassword!: string;

  // TODO: Create reggex to make sure that phone number only contains numbers, "-" and "+"
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class LoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class ForgotPasswordDTO {
  @IsEmail()
  email!: string;
}

export class GetUserToResetPasswordDTO {
  @IsOptional()
  q!: string;
}

export class ResetPasswordBody {
  @IsString()
  @ContainsLettersAndNumbers('password')
  password!: string;

  @IsString()
  @Match('password')
  checkPassword!: string;
}

export class ResetPasswordDTO extends ResetPasswordBody {
  @IsOptional()
  q!: string;
}
