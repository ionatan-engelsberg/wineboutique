import { Service } from 'typedi';

import { BaseRepository } from './repository';

import { BlogModel } from '../database/Blog';
import { Blog } from '../interfaces';

@Service({ transient: true })
export class BlogRepository extends BaseRepository<Blog> {
  constructor() {
    super(BlogModel);
  }
}
