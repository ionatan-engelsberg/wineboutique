import { Service } from 'typedi';
import { JsonController } from 'routing-controllers';

import { OrderAdapter } from '../adapters/order.adapter';

@JsonController('/orders')
@Service({ transient: true })
export class OrderController {
  constructor(private readonly _orderAdapter: OrderAdapter) {}
}
