import { WEB_URL } from '../config/config';

// TODO
export const getVerifyAccountEmailHtml = (userId: string, verificationToken: string) =>
  `userId: ${userId}. verificationToken: ${verificationToken}. URL: ${WEB_URL}`;
