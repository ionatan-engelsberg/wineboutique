import { UserRole } from '../types/User.types';
import { ObjectId } from '../types/ObjectId';

export interface User {
  _id?: ObjectId;

  firstName: string;

  lastName: string;

  email: string;

  birthdate: Date;

  phoneNumber?: string;

  password: string;

  isActive: boolean;

  resetPasswordToken?: string | null;

  resetPasswordTokenExpirationDate?: Date | null;

  role: UserRole;
}
