import { Service } from 'typedi';

import { NewsletterService } from '../services/newsletter.service';

import { SuscribeToNewsletterDTO, UnsuscribeFromNewsletterDTO } from '../dto/Newsletter.dto';

@Service({ transient: true })
export class NewsletterAdapter {
  constructor(private readonly _newsletterService: NewsletterService) {}

  async suscribeToNewsletter(dto: SuscribeToNewsletterDTO) {
    const { email } = dto;
    return this._newsletterService.suscribeToNewsletter(email);
  }

  async unsuscribeFromNewsletter(dto: UnsuscribeFromNewsletterDTO) {
    const { email } = dto;
    return this._newsletterService.unsuscribeFromNewsletter(email);
  }
}
