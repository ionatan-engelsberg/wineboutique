import { Service } from 'typedi';
import { Get, HttpCode, JsonController, Param, Post, QueryParams, Req } from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { ProductAdapter } from '../adapters/product.adapter';

import {
  GetManyProductsByIdsDTO,
  GetProductByIdDTO,
  GetProductsDTO,
  GetProductsFilters
} from '../dto/Product.dto';

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
    filters: GetProductsFilters,
    @Req() req: any
  ) {
    const userJWT = req.user;
    const dto: GetProductsDTO = { filters, userJWT };

    return this._productAdapter.getProducts(dto);
  }

  @Get('/many')
  async getManyProductsByIds(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: GetManyProductsByIdsDTO
  ) {
    return this._productAdapter.getManyProductsByIds(dto);
  }

  @Get('/:productId')
  async getProductById(@Req() req: any, @Param('productId') productId: string) {
    const userJWT = req.user;
    const dto: GetProductByIdDTO = { productId, userJWT };

    return this._productAdapter.getProductById(dto);
  }
}
