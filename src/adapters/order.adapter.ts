import { Service } from 'typedi';
import { CreateOrderDTO, GetOrderShippingFeeDTO } from '../dto/Order.dto';

import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Service({ transient: true })
export class OrderAdapter {
  constructor(
    private readonly _orderService: OrderService,
    private readonly _userService: UserService
  ) {}

  async createOrder(dto: CreateOrderDTO) {
    const { userJWT, items, payer, shipment, paymentMethod } = dto;

    const { userId } = userJWT;
    const user = await this._userService.findById(userId);

    return this._orderService.createOrder(user, payer, items, shipment, paymentMethod);
  }

  async getOrderShippingFee(dto: GetOrderShippingFeeDTO) {
    const { shipment: shipmentBoolean, postalCode, productIds } = dto;
    const shipment = { shipment: shipmentBoolean, postalCode };

    return this._orderService.getShippingFee(shipment, productIds);
  }
}
