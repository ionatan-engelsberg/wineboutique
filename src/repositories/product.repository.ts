import { Service } from 'typedi';

import { InternalServerError } from '../errors/base.error';

import { BaseRepository } from './repository';

import { ProductModel } from '../database/Product';
import { Product } from '../interfaces';
import { replaceIds } from '../utils/replaceIds';
import { logErrors } from '../utils/logger';

@Service({ transient: true })
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(ProductModel);
  }

  async getProductsFilters(params: Object, addToSetObject: any): Promise<any> {
    let filters: any;
    try {
      filters = await ProductModel.aggregate([
        { $match: { ...params } },
        {
          $group: {
            _id: 0,
            ...addToSetObject
          }
        }
      ]);
    } catch (error) {
      logErrors(error);
      throw new InternalServerError('There was an error while finding Products filters');
    }
    return filters;
  }

  async getProducts(
    params: Object,
    limit: number,
    sort: any,
    selectFields: string,
    offset: number = 0
  ): Promise<Product[]> {
    let objs: Product[] | null;
    try {
      objs = (await ProductModel.find(params)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .select(selectFields)
        .lean()) as Product[];
    } catch (error) {
      console.log(`WARNING: There was an error while finding ${this.modelName}s`);
      logErrors(error);
      objs = [];
    }
    return objs.map((obj: Product) => replaceIds(obj) as Product);
  }
}
