import { Service } from 'typedi';
import nodemailer from 'nodemailer';

import { InternalServerError } from '../errors/base.error';

// TODO: Temporal. Change for Sendgrid on production
import { ETHEREAL_USERNAME, ETHEREAL_PASSWORD } from '../config/config';

import { User } from '../interfaces';

import { getVerifyAccountEmailHtml } from '../utils/getEmailHtml';

const TEST_USER_EMAIL = 'mike.hammes90@ethereal.email';
// TEST_USER_PASSWORD = '6YhpDkG6yv5xEhGE6y'

@Service({ transient: true })
export class EmailService {
  constructor() {}

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
    console.log('MESSAGE URL: ', nodemailer.getTestMessageUrl(info));
  }

  async sendVerifyAccountEmail(user: User) {
    const { email: toEmail, _id: userId, verificationToken } = user;
    const fromEmail = ETHEREAL_USERNAME;

    if (!fromEmail) {
      throw new InternalServerError('No email address configured to send an email');
    }

    const subject = 'Verify account';
    const html = getVerifyAccountEmailHtml(userId! as string, verificationToken!);

    await this.sendEmail(toEmail, fromEmail, subject, html);
  }
}
