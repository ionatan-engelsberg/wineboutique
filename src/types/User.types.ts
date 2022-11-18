export enum UserRole {
  OWNER = 'OWNER',
  COFOUNDER = 'COFOUNDER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface UserJWT {
  userId: string;

  role: UserRole;
}
