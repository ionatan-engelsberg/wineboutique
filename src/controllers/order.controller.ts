import { Service } from 'typedi';
import {
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParams
} from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';
import { OrderAdapter } from '../adapters/order.adapter';

import { UserJWT } from '../types/User.types';
import { CreateOrderBody, CreateOrderDTO, GetOrderShippingFeeDTO } from '../dto/Order.dto';

@JsonController('/orders')
@Service({ transient: true })
export class OrderController {
  constructor(private readonly _orderAdapter: OrderAdapter) {}

  @Post()
  @HttpCode(HttpStatusCode.CREATED)
  async createOrder(
    @CurrentUser() userJWT: UserJWT,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: CreateOrderBody
  ) {
    const dto: CreateOrderDTO = { userJWT, ...body };
    return this._orderAdapter.createOrder(dto);
  }

  @Get('/shipping_fee')
  async getOrderShippingFee(
    @CurrentUser() userJWT: UserJWT,
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: GetOrderShippingFeeDTO
  ) {
    return this._orderAdapter.getOrderShippingFee(dto);
  }
}
