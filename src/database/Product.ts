import { Schema, model } from 'mongoose';
import { DEFAULT_PRODUCT_IMAGE_URL } from '../config/config';
import { Product } from '../interfaces';
import { getCurrentDate } from '../utils/getCurrentDate';

export const ProductSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      uppercase: true
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
    year: {
      type: Number,
      min: 0,
      max: getCurrentDate().getFullYear()
    },
    type: {
      type: String,
      required: [true, 'Product type is required'],
      trim: true,
      uppercase: true
    },
    region: {
      type: String,
      trim: true,
      uppercase: true
    },
    featuredInHome: {
      type: Boolean,
      default: false
    },
    outlined: {
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
    }
  },
  { versionKey: false }
);

export const ProductModel = model<Product>('Product', ProductSchema);
