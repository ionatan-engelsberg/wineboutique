import { Service } from 'typedi';

import { BaseRepository } from './repository';

import { OrderModel } from '../database/Order';
import { Order } from '../interfaces';

@Service({ transient: true })
export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(OrderModel);
  }

  
}
