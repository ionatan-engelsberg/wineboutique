import { Service } from 'typedi';
import uniqid from 'uniqid';

import { BlogRepository } from '../repositories/blog.repository';

import { ObjectId } from '../types/ObjectId';

import { getCurrentDate } from '../utils/getCurrentDate';

const DEFAULT_LIMIT = 6;

@Service({ transient: true })
export class BlogService {
  constructor(private readonly _blogRepository: BlogRepository) {}

  // TODO: Temporal
  async createTestBlogs() {
    let i = 0;
    while (i < 20) {
      const title = uniqid();

      let text = '';
      let j = 0;
      while (j < 50) {
        const subtext = uniqid();
        text = `${text} ${subtext}`;
        j += 1;
      }

      const dateCreated = getCurrentDate();

      const blog = {
        title,
        text,
        dateCreated
      };

      await this._blogRepository.create(blog);
      i += 1;
    }
  }

  async getBlogs(page: number, receivedLimit?: number) {
    const sort = { dateCreated: 1 };
    const limit = receivedLimit ?? DEFAULT_LIMIT;
    const options = { skip: page - 1, sort, limit };

    const blogs = await this._blogRepository.findMany({}, options);

    const totalCount = await this._blogRepository.countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    return { totalPages, blogs };
  }

  async getBlogById(blogId: ObjectId) {
    return this._blogRepository.findById(blogId);
  }
}
