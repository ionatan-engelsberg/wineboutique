import { OrderAddress } from '../interfaces';
import { ObjectId } from './ObjectId';

export enum OrderTaxStatus {
  FINAL_CONSUMER = 'FINAL_CONSUMER',
  REGISTERED_MANAGER = 'REGISTERED_MANAGER'
}

export enum OrderPaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  WIRE_TRANSFER = 'WIRE_TRANSFER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// TODO
export enum OrderAddressCity {
  CABA = 'CABA',
  BUENOS_AIRES = 'BUENOS_AIRES'
}

export interface OrderProduct {
  _id: ObjectId;

  amount: number;
}

export interface OrderShipment {
  shipment: boolean;

  address?: OrderAddress;
}
