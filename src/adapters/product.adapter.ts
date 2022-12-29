import { Service } from 'typedi';
import { omit } from 'lodash';

import { ProductService } from '../services/product.service';

import {
  GetFeaturedProductsDTO,
  GetAvailableFiltersDTO,
  GetManyProductsByIdsDTO,
  GetProductByIdDTO,
  GetProductsDTO,
  CreateProductDTO,
  DeleteProductDTO,
  UpdateProductDTO,
  UpdateProductsMassivelyDTO
} from '../dto/Product.dto';
import { Product } from '../interfaces';

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

  async getAvailableFilters(dto: GetAvailableFiltersDTO) {
    const { filters } = dto;
    return this._productService.getAvailableFilters(filters);
  }

  async getProductById(dto: GetProductByIdDTO) {
    const { productId, userJWT } = dto;
    return this._productService.getProductById(productId, userJWT);
  }

  async getManyProductsByIds(dto: GetManyProductsByIdsDTO) {
    const { productIds, specialIds } = dto;

    const products = await this._productService.getManyProductsByIds(productIds, specialIds);

    const omitFields = ['description', 'featuredInHome', 'outlined'];
    const parsedObject: { wines: []; oils: []; opportunityBoxes: [] } = {
      wines: [],
      oils: [],
      opportunityBoxes: []
    };

    for (const key in products) {
      const parsedProducts = products[key].map((prod) => omit(prod, omitFields));
      parsedObject[key] = parsedProducts;
    }

    return parsedObject;
  }

  async getFeaturedProducts(dto: GetFeaturedProductsDTO) {
    const { filters, userJWT } = dto;
    return this._productService.getFeaturedProducts(filters, userJWT);
  }

  async createProduct(dto: CreateProductDTO) {
    const product: Product = { ...dto };
    return this._productService.createProduct(product);
  }

  async deleteProduct(dto: DeleteProductDTO) {
    const { productId } = dto;
    return this._productService.deleteProduct(productId);
  }

  async updateProduct(dto: UpdateProductDTO) {
    const { productId, ...newProduct } = dto;

    const oldProduct = await this._productService.findById(productId);
    const { category, brand, grape, type } = oldProduct;

    const updatedProduct = {
      _id: oldProduct._id,
      ...newProduct,
      category,
      brand,
      grape,
      type
    };

    return this._productService.updateProduct(oldProduct, updatedProduct);
  }

  async updateProductsMassively(dto: UpdateProductsMassivelyDTO) {
    const { filename } = dto;
    return this._productService.updateProductsMassively(filename);
  }
}
