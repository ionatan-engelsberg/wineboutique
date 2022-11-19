import { ObjectId } from '../types/ObjectId';

export interface Product {
  _id?: ObjectId;

  name: string;

  description: string;

  price: number;

  brand: string;

  grape: string;

  year: number;

  type: string; // TODO: Enum

  region: string;

  featuredInHome: boolean;

  outlined: boolean;

  stock: number;

  image?: string;
}
