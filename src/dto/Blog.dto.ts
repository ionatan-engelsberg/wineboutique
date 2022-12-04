import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetBlogsDTO {
  @IsNumber()
  @Min(0)
  page!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class GetBlogByIdDTO {
  @IsString()
  blogId!: string;
}
