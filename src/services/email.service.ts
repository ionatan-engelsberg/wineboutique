import { Service } from 'typedi';
import nodemailer from 'nodemailer';

import { InternalServerError } from '../errors/base.error';

// TODO: Temporal. Change for Sendgrid on production
import { ETHEREAL_USERNAME, ETHEREAL_PASSWORD } from '../config/config';

import { CredentialsService } from './credentials.service';

import { User } from '../interfaces';

import { getForgotPasswordEmailHtml } from '../utils/emails/getForgotPasswordHtml';

const TEST_USER_EMAIL = 'mike.hammes90@ethereal.email';
// TEST_USER_PASSWORD = '6YhpDkG6yv5xEhGE6y'

@Service({ transient: true })
export class EmailService {
  constructor(private readonly _credentialsService: CredentialsService) {}

  private async sendEmail(to: string, from: string, subject: string, html: any) {
    // TODO: Temporal. Change for Sendgrid on production
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: ETHEREAL_USERNAME,
        pass: ETHEREAL_PASSWORD
      }
    });

    const info = await transporter.sendMail({ from, to: TEST_USER_EMAIL, subject, html });
    console.log('TODO - MESSAGE URL: ', nodemailer.getTestMessageUrl(info));
  }

  async sendForgotPasswordEmail(user: User) {
    const { email: toEmail, _id: userId, resetPasswordToken } = user;
    const fromEmail = ETHEREAL_USERNAME;

    if (!fromEmail) {
      throw new InternalServerError('No email address configured to send an email');
    }

    // TODO
    const subject = 'Reset password';

    const hashedResetPasswordInfo = await this._credentialsService.createResetPasswordToken(
      userId! as string,
      resetPasswordToken!
    );

    const html = getForgotPasswordEmailHtml(hashedResetPasswordInfo);

    await this.sendEmail(toEmail, fromEmail, subject, html);
  }
}
