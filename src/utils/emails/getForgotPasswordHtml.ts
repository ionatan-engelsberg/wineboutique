import { WEB_URL } from '../../config/config';

// TODO
export const getForgotPasswordEmailHtml = (token: string) =>
  `URL: ${WEB_URL}/${token}`;
