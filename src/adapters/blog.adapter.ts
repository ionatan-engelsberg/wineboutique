import { Service } from 'typedi';

import { BlogService } from '../services/blog.service';

import { GetBlogsDTO } from '../dto/Blog.dto';

@Service({ transient: true })
export class BlogAdapter {
  constructor(private readonly _blogService: BlogService) {}

  async createTestBlogs() {
    await this._blogService.createTestBlogs();
  }

  async getBlogs(dto: GetBlogsDTO) {
    const { page, limit } = dto;
    return this._blogService.getBlogs(page, limit);
  }
}
