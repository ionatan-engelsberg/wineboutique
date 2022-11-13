import { UserRole } from '../types/User.types';

export interface User {
  firstName: string;

  lastName: string;

  email: string;

  birthdate: Date;

  password: string;

  isVerified: boolean;

  isActive: boolean;

  verificationToken: string | null;

  verificationTokenExpirationDate: Date | null;

  resetPasswordToken: string | null;

  resetPasswordTokenExpirationDate: Date | null;

  role: UserRole;

  accessToken?: string;
}
