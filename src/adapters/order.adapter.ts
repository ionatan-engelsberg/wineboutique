import { Service } from 'typedi';

import { OrderService } from '../services/order.service';

@Service({ transient: true })
export class OrderAdapter {
  constructor(private readonly _orderService: OrderService) {}
}
