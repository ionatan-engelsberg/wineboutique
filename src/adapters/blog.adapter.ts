import { Service } from 'typedi';

import { BlogService } from '../services/blog.service';

import { GetBlogByIdDTO, GetBlogsDTO } from '../dto/Blog.dto';

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

  async getBlogById(dto: GetBlogByIdDTO) {
    const { blogId } = dto;
    return this._blogService.getBlogById(blogId);
  }
}
