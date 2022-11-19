import { Service } from 'typedi';

import { ProductService } from '../services/product.service';

@Service({ transient: true })
export class ProductAdapter {
  constructor(private readonly _productService: ProductService) {}

  async createTestProducts() {
    await this._productService.createTestProducts();
  }

  async getProducts() {
    return this._productService.getProducts()
  }
}
