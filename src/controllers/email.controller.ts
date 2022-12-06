import { Service } from 'typedi';
import { Body, JsonController, OnUndefined, Post } from 'routing-controllers';

import { EmailAdapter } from '../adapters/email.adapter';
import { SendContactEmailDTO } from '../dto/Email.dto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@JsonController('/contact')
@Service({ transient: true })
export class EmailController {
  constructor(private readonly _emailAdapter: EmailAdapter) {}

  @Post()
  @OnUndefined(HttpStatusCode.NO_CONTENT)
  async sendContactEmail(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) dto: SendContactEmailDTO
  ) {
    await this._emailAdapter.sendContactEmail(dto);
  }
}
