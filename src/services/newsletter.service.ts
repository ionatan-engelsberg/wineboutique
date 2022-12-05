import { Service } from 'typedi';

import { NotFoundError } from '../errors/base.error';

import { Newsletter } from '../interfaces';

import { NewsletterRepository } from '../repositories/newsletter.repository';

@Service({ transient: true })
export class NewsletterService {
  constructor(private readonly _newsletterRepository: NewsletterRepository) {}

  async suscribeToNewsletter(email: string) {
    let newsletter: Newsletter;

    // TODO
    try {
      const newsletters = await this._newsletterRepository.findMany({});

      if (!newsletters || newsletters.length === 0) {
        throw new NotFoundError('No newsletter found');
      }

      newsletter = newsletters[0];
    } catch (error) {
      const newNewsletter = { emails: [] };
      newsletter = await this._newsletterRepository.create(newNewsletter);
    }

    const isEmailInNewsletter = newsletter.emails.find((e) => e === email);

    if (isEmailInNewsletter) {
      return;
    }

    newsletter.emails.push(email);
    await this._newsletterRepository.update(newsletter);
  }
}
