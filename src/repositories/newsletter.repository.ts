import { Service } from 'typedi';

import { BaseRepository } from './repository';

import { NewsletterModel } from '../database/Newsletter';
import { Newsletter } from '../interfaces';

@Service({ transient: true })
export class NewsletterRepository extends BaseRepository<Newsletter> {
  constructor() {
    super(NewsletterModel);
  }
}
