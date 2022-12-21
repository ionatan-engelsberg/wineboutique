import { ObjectId } from '../types/ObjectId';
import { ProductCategory } from '../types/Product.types';

export interface Product {
  _id?: ObjectId;

  name: string;

  description?: string;

  price: number;

  brand: string;

  grape: string;

  type?: string;

  featuredInHome: boolean;

  stock: number;

  image?: string;

  imageId?: string;

  category: ProductCategory;

  // TODO
  weight?: number;

  volume?: number;
}
