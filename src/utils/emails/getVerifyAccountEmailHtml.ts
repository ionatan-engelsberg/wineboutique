import { WEB_URL } from '../../config/config';

// TODO
export const getVerifyAccountEmailHtml = (token: string) =>
  `URL: ${WEB_URL}/${token}`;
