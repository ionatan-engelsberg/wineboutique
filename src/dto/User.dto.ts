import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsObject,
  IsNumber
} from 'class-validator';
import { ValidNewUserWithRole } from '../utils/validators/createUserRole';
import { ContainsLettersAndNumbers } from '../utils/validators/passwordRegex';
import { Match } from '../utils/validators/passwordsAreEqual';

import { UserRole } from '../types/User.types';

class UserJWT {
  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  firstName!: string;
}

export class GetUsersWithRoleDTO extends UserJWT {}

export class CreateUserWithRoleBody {
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

  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @IsEnum(UserRole)
  @ValidNewUserWithRole('role')
  role!: UserRole;
}

export class CreateUserWithRoleDTO extends CreateUserWithRoleBody {
  @IsObject()
  userJWT!: UserJWT;
}

export class UpdateUserBody {
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

  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @IsOptional()
  @IsEnum(UserRole)
  // @ValidNewUserWithRole('role') // TODO
  role?: UserRole;
}

export class UpdateUserDTO extends UpdateUserBody {
  @IsString()
  userId!: string;

  @IsObject()
  userJWT!: UserJWT;
}

export class DeleteUserDTO {
  @IsString()
  userId!: string;

  @IsObject()
  userJWT!: UserJWT;
}

export class GetUserByIdDTO {
  @IsString()
  userId!: string;

  @IsObject()
  userJWT!: UserJWT;
}

export class UpdateUserPasswordBody {
  @IsString()
  oldPassword!: string;

  @IsString()
  @ContainsLettersAndNumbers('password')
  password!: string;

  @IsString()
  @Match('password')
  checkPassword!: string;
}

export class UpdateUserPasswordDTO extends UpdateUserPasswordBody {
  @IsObject()
  userJWT!: UserJWT;

  @IsString()
  userId!: string;
}

export class GetCurrentUserDTO {
  @IsOptional()
  @IsObject()
  userJWT?: UserJWT;
}
