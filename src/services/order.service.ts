import { Service } from 'typedi';

import { OrderRepository } from '../repositories/order.repository';

@Service({ transient: true })
export class OrderService {
  constructor(private readonly _orderRepository: OrderRepository) {}
}
