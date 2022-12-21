import { ObjectId } from '../types/ObjectId';
import {
  OrderAddressCity,
  OrderPaymentMethod,
  OrderStatus,
  OrderTaxStatus
} from '../types/Order.types';

export interface OrderPayer {
  firstName: string;

  lastName: string;

  identification: number;

  taxStatus: OrderTaxStatus;

  businessName?: string;
}

export interface OrderItem {
  productId: ObjectId;

  name: string;

  image: string;

  price: number;

  amount: number;
}

export interface OrderAddress {
  postalCode: number;

  city: OrderAddressCity;

  locality: string;

  street: string;

  number: string;

  floor?: string;

  apartment?: string;
}

export interface Order {
  _id?: ObjectId;

  user: ObjectId;

  payer: OrderPayer;

  items: OrderItem[];

  subtotal: number;

  shippingFee: number;

  discount: number;

  total: number;

  orderNumber: number;

  securityCode: number;

  paymentMethod: OrderPaymentMethod;

  shipment: boolean;

  address?: OrderAddress;

  status: OrderStatus;
}
