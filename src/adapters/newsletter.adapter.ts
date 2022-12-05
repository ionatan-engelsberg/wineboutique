import { Service } from 'typedi';

import { NewsletterService } from '../services/newsletter.service';

import { SuscribteToNewsletterDTO } from '../dto/Newsletter.dto';

@Service({ transient: true })
export class NewsletterAdapter {
  constructor(private readonly _newsletterService: NewsletterService) {}

  async suscribeToNewsletter(dto: SuscribteToNewsletterDTO) {
    const { email } = dto;
    return this._newsletterService.suscribeToNewsletter(email);
  }
}
