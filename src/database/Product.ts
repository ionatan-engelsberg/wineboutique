import { Schema, model } from 'mongoose';
import { DEFAULT_PRODUCT_IMAGE_URL } from '../config/config';
import { Product } from '../interfaces';
import { ProductCategory } from '../types/Product.types';

export const ProductSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      uppercase: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
      // TODO: Max length
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
      uppercase: true
    },
    grape: {
      type: String,
      required: [true, 'Product grape is required'],
      trim: true,
      uppercase: true
    },
    type: {
      type: String,
      required: [true, 'Product type is required'],
      trim: true,
      uppercase: true
    },
    category: {
      type: String,
      enum: {
        values: Object.values(ProductCategory),
        message: `Product category must be one of the following: ${Object.values(ProductCategory)}`
      },
      required: [true, 'Product category is required'],
      trim: true,
      uppercase: true
    },
    featuredInHome: {
      type: Boolean,
      default: false
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: 0
    },
    image: {
      type: String,
      default: DEFAULT_PRODUCT_IMAGE_URL
    },
    imageId: {
      type: String
    }
  },
  { versionKey: false }
);

export const ProductModel = model<Product>('Product', ProductSchema);
