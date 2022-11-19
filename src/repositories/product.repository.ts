import { Service } from 'typedi';

import { BaseRepository } from './repository';

import { ProductModel } from '../database/Product';
import { Product } from '../interfaces';

@Service({ transient: true })
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(ProductModel);
  }
}
