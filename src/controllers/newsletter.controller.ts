import { Service } from 'typedi';
import { Body, Delete, JsonController, OnUndefined, Post, QueryParams } from 'routing-controllers';

import { NewsletterAdapter } from '../adapters/newsletter.adapter';

import { SuscribeToNewsletterDTO, UnsuscribeFromNewsletterDTO } from '../dto/Newsletter.dto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@JsonController('/newsletter')
@Service({ transient: true })
export class NewsletterController {
  constructor(private readonly _newsletterAdapter: NewsletterAdapter) {}

  @Post()
  @OnUndefined(HttpStatusCode.NO_CONTENT)
  async suscribeToNewsletter(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: SuscribeToNewsletterDTO
  ) {
    await this._newsletterAdapter.suscribeToNewsletter(dto);
  }

  @Delete()
  @OnUndefined(HttpStatusCode.NO_CONTENT)
  async unsuscribeFromNewsletter(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: UnsuscribeFromNewsletterDTO
  ) {
    await this._newsletterAdapter.unsuscribeFromNewsletter(dto);
  }
}
