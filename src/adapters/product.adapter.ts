import { Service } from 'typedi';

import { ProductService } from '../services/product.service';

import { GetProductsDTO } from '../dto/Product.dto';

@Service({ transient: true })
export class ProductAdapter {
  constructor(private readonly _productService: ProductService) {}

  async createTestProducts() {
    await this._productService.createTestProducts();
  }

  async getProducts(dto: GetProductsDTO) {
    const { filters } = dto;
    return this._productService.getProducts(filters);
  }
}
