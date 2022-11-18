import { UserRole } from '../types/User.types';
import { ObjectId } from '../types/ObjectId';

export interface User {
  _id?: ObjectId;

  firstName: string;

  lastName: string;

  email: string;

  birthdate: Date;

  phoneNumber?: number;

  password: string;

  isVerified: boolean;

  isActive: boolean;

  verificationToken?: string | null;

  verificationTokenExpirationDate?: Date | null;

  resetPasswordToken?: string | null;

  resetPasswordTokenExpirationDate?: Date | null;

  role: UserRole;

  accessToken?: string;
}
