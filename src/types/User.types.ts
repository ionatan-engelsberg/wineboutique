export enum UserRole {
  OWNER,
  COFOUNDER,
  ADMIN,
  USER
}

export interface UserJWT {
  userId: string;

  role: UserRole;

  accessToken: string | null;
}
