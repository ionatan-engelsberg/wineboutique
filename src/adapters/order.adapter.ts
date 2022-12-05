import { Service } from 'typedi';
import { CreateOrderDTO } from '../dto/Order.dto';

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
}
