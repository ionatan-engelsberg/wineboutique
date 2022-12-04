import { Schema, model } from 'mongoose';

import { Blog } from '../interfaces';
import { BLOG_TITLE_MAX_LENGTH } from '../types/Blog.types';
import { DEFAULT_BLOG_IMAGE_URL } from '../config/config';

export const BlogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: BLOG_TITLE_MAX_LENGTH
    },
    text: {
      type: String,
      required: [true, 'Blog text is required'],
      trim: true
    },
    image: {
      type: String,
      default: DEFAULT_BLOG_IMAGE_URL
    },
    dateCreated: {
      type: Date,
      required: [true, 'Blog date is required']
    }
  },
  { versionKey: false }
);

export const BlogModel = model<Blog>('Blog', BlogSchema);
