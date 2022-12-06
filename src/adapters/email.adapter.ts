import { Service } from 'typedi';

import { SendContactEmailDTO } from '../dto/Email.dto';

import { EmailService } from '../services/email.service';

@Service({ transient: true })
export class EmailAdapter {
  constructor(private readonly _emailService: EmailService) {}

  async sendContactEmail(dto: SendContactEmailDTO) {
    const { firstName, lastName, email, subject, message } = dto;
    return this._emailService.sendContactEmail(firstName, lastName, email, subject, message);
  }
}
