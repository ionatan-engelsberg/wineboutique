import { Service } from 'typedi';
import { JsonController, Post } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { ProductAdapter } from '../adapters/product.adapter';

@JsonController('/products')
@Service({ transient: true })
export class ProductController {
  constructor(private readonly _productAdapter: ProductAdapter) {}

  @Post('/test')
  async createTestProducts() {
    await this._productAdapter.createTestProducts();
  }
}
