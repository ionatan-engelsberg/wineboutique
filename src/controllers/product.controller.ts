import { Service } from 'typedi';
import { Get, HttpCode, JsonController, Post, QueryParams } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { ProductAdapter } from '../adapters/product.adapter';

import { GetProductsDTO, GetProductsFilters } from '../dto/Product.dto';

@JsonController('/products')
@Service({ transient: true })
export class ProductController {
  constructor(private readonly _productAdapter: ProductAdapter) {}

  @Post('/test')
  async createTestProducts() {
    await this._productAdapter.createTestProducts();
  }

  @Get()
  @HttpCode(HttpStatusCode.OK)
  async getProducts(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    filters: GetProductsFilters
  ) {
    const dto: GetProductsDTO = { filters };
    return this._productAdapter.getProducts(dto);
  }
}
