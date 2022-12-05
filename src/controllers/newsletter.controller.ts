import { Service } from 'typedi';
import { Body, JsonController, OnUndefined, Post } from 'routing-controllers';

import { NewsletterAdapter } from '../adapters/newsletter.adapter';

import { SuscribteToNewsletterDTO } from '../dto/Newsletter.dto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@JsonController('/newsletter')
@Service({ transient: true })
export class NewsletterController {
  constructor(private readonly _newsletterAdapter: NewsletterAdapter) {}

  @Post()
  @OnUndefined(HttpStatusCode.NO_CONTENT)
  async suscribeToNewsletter(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: SuscribteToNewsletterDTO
  ) {
    await this._newsletterAdapter.suscribeToNewsletter(dto);
  }
}
