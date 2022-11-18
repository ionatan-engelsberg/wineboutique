import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  IsEnum
} from 'class-validator';
import { ValidNewUserRole } from '../utils/validators/createUserRole';

import { UserRole } from '../types/User.types';

export class GetUsersWithRoleDTO {
  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  accessToken!: string;
}

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
  @ValidNewUserRole('role')
  role!: UserRole;
}

export class CreateUserWithRoleDTO extends CreateUserWithRoleBody {
  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  userRole!: UserRole;

  @IsString()
  accessToken!: string | null;
}
