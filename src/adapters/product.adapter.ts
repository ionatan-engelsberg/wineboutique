import { Service } from 'typedi';

import { ProductService } from '../services/product.service';

import { GetProductByIdDTO, GetProductsDTO } from '../dto/Product.dto';

@Service({ transient: true })
export class ProductAdapter {
  constructor(private readonly _productService: ProductService) {}

  async createTestProducts() {
    await this._productService.createTestProducts();
  }

  async getProducts(dto: GetProductsDTO) {
    const { filters, userJWT } = dto;
    return this._productService.getProducts(filters, userJWT);
  }

  async getProductById(dto: GetProductByIdDTO) {
    const { productId, userJWT } = dto;
    return this._productService.getProductById(productId, userJWT);
  }
}
