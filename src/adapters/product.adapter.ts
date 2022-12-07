import { Service } from 'typedi';
import { omit } from 'lodash';

import { ProductService } from '../services/product.service';

import {
  GetFeaturedProductsDTO,
  GetManyProductsByIdsDTO,
  GetProductByIdDTO,
  GetProductsDTO
} from '../dto/Product.dto';

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

  async getAvailableFilters() {
    return this._productService.getAvailableFilters();
  }

  async getProductById(dto: GetProductByIdDTO) {
    const { productId, userJWT } = dto;
    return this._productService.getProductById(productId, userJWT);
  }

  async getManyProductsByIds(dto: GetManyProductsByIdsDTO) {
    const { productIds } = dto;

    const products = await this._productService.getManyProductsByIds(productIds);

    const omitFields = ['description', 'featuredInHome', 'outlined'];
    return products.map((prod) => omit(prod, omitFields));
  }

  async getFeaturedProducts(dto: GetFeaturedProductsDTO) {
    const { filters, userJWT } = dto;
    return this._productService.getFeaturedProducts(filters, userJWT);
  }
}
