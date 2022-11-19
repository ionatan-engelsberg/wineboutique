import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsObject
} from 'class-validator';
import { ValidNewUserWithRole } from '../utils/validators/createUserRole';

import { UserRole } from '../types/User.types';

class UserJWT {
  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  role!: UserRole;
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
  @IsPhoneNumber('AR')
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
  @IsPhoneNumber('AR')
  phoneNumber?: number;

  @IsEnum(UserRole)
  // @ValidNewUserWithRole('role')
  role!: UserRole;
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
