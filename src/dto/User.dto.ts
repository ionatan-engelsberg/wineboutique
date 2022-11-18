import { IsEnum, IsString } from 'class-validator';

import { UserRole } from '../types/User.types';

export class GetUsersWithRoleDTO {
  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  accessToken!: string;
}
