import { ObjectId } from '../types/ObjectId';
import { SpecialCategory } from '../types/Special.types';

export interface SpecialProduct {
  productId: ObjectId;

  name: string;

  price: number;
}

// TODO: Change name
export interface Special {
  _id?: ObjectId;

  category: SpecialCategory;

  stock: number;

  price: number;

  products: SpecialProduct[];

  image?: string;

  date?: Date; // NOTE: Tasting

  description?: string; // NOTE: Opportunity box

  title?: string; // NOTE: Opportunity box
}
