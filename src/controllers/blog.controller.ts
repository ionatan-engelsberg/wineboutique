import { Service } from 'typedi';
import { Get, HttpCode, JsonController, Post, QueryParams } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { BlogAdapter } from '../adapters/blog.adapter';

import { GetBlogsDTO } from '../dto/Blog.dto';

@JsonController('/blogs')
@Service({ transient: true })
export class BlogController {
  constructor(private readonly _blogAdapter: BlogAdapter) {}

  @HttpCode(HttpStatusCode.CREATED)
  @Post('/test')
  async createTestBlogs() {
    await this._blogAdapter.createTestBlogs();
  }

  @Get()
  async getBlogs(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } }) dto: GetBlogsDTO
  ) {
    return this._blogAdapter.getBlogs(dto);
  }
}
