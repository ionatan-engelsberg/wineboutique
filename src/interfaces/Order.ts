import { ObjectId } from '../types/ObjectId';
import { OrderPaymentMethod, OrderStatus, OrderTaxStatus } from '../types/Order.types';

export interface OrderItem {
  productId: ObjectId;

  name: string;

  image: string;

  price: number;

  amount: number;
}

export interface OrderAddress {
  street: string;

  number: string | number;

  floor?: string | number;

  apartment?: string | number;
}

export interface Order {
  _id?: ObjectId;

  user: ObjectId;

  items: OrderItem[];

  subtotal: number;

  shippingFee: number;

  discount: number;

  total: number;

  taxStatus: OrderTaxStatus;

  orderNumber: number;

  securityCode: number;

  paymentMethod: OrderPaymentMethod;

  shipment: boolean;

  address?: OrderAddress;

  status: OrderStatus;
}
