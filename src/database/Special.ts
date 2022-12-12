import { Schema, model } from 'mongoose';
import { DEFAULT_PRODUCT_IMAGE_URL } from '../config/config';
import { Special, SpecialProduct } from '../interfaces';
import { SpecialCategory } from '../types/Special.types';

const SpecialProductSchema = new Schema<SpecialProduct>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product id is required']
  },
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: [true, 'Product name is required']
  },
  price: {
    type: Number,
    min: 0,
    required: [true, 'Product price is required']
  }
});

export const SpecialSchema = new Schema<Special>(
  {
    category: {
      type: String,
      enum: {
        values: Object.values(SpecialCategory),
        message: `Special category must be one of the following: ${Object.values(SpecialCategory)}`
      },
      required: [true, 'Special category is required'],
      trim: true,
      uppercase: true
    },
    stock: {
      type: Number,
      required: [true, 'Special stock is required'],
      min: 0
    },
    price: {
      type: Number,
      required: [true, 'Special price is required'],
      min: 0
    },
    products: {
      type: [SpecialProductSchema],
      required: [true, 'Special products are required'],
      _id: false
    },
    image: {
      type: String,
      default: DEFAULT_PRODUCT_IMAGE_URL
    },
    date: {
      type: Date
    },
    description: {
      type: String,
      trim: true
      // TODO: Max length
    },
    title: {
      type: String,
      trim: true
      // TODO: Max length
    }
  },
  { versionKey: false }
);

export const SpecialModel = model<Special>('Special', SpecialSchema);
