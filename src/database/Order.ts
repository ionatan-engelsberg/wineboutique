import { Schema, model } from 'mongoose';

import { Order, OrderItem, OrderAddress, OrderPayer } from '../interfaces';
import {
  OrderAddressCity,
  OrderPaymentMethod,
  OrderStatus,
  OrderTaxStatus
} from '../types/Order.types';

const OrderPayerSchema = new Schema<OrderPayer>(
  {
    firstName: {
      type: String,
      required: [true, 'Payer first name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Payer last name is required']
    },
    identification: {
      type: Number,
      required: [true, 'Payer identification is required']
    },
    taxStatus: {
      type: String,
      required: [true, 'Order tax status is required'],
      enum: {
        values: Object.values(OrderTaxStatus),
        message: `Order tax status must be one of the following: ${Object.values(OrderTaxStatus)}`
      }
    },
    businessName: {
      type: String
    }
  },
  { versionKey: false }
);

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product id is required']
    },
    name: {
      type: String,
      required: [true, 'Product name is required']
    },
    image: {
      type: String,
      required: [true, 'Product image is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0
    },
    amount: {
      type: Number,
      required: [true, 'Product amount is required'],
      min: 1
    }
  },
  { versionKey: false }
);

const OrderAddressSchema = new Schema<OrderAddress>(
  {
    city: {
      type: String,
      required: [true, 'Address city is required'],
      enum: {
        values: Object.values(OrderAddressCity),
        message: `Address city must be one of the following: ${Object.values(OrderAddressCity)}`
      }
    },
    locality: {
      type: String,
      required: [true, 'Address locality is required']
    },
    street: {
      type: String,
      required: [true, 'Address street is required']
    },
    number: {
      type: String,
      required: [true, 'Address number is required']
    },
    floor: {
      type: String,
      required: [true, 'Address floor is required']
    },
    apartment: {
      type: String,
      required: [true, 'Address apartment is required']
    }
  },
  { versionKey: false }
);

export const OrderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order user is required']
    },
    payer: {
      type: OrderPayerSchema,
      required: [true, 'Order payer is required'],
      _id: false
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      _id: false
    },
    subtotal: {
      type: Number,
      required: [true, 'Order subtotal is required'],
      min: 0
    },
    shippingFee: {
      type: Number,
      required: [true, 'Order shippingFee is required'],
      min: 0
    },
    discount: {
      type: Number,
      required: [true, 'Order discount is required'],
      min: 0
    },
    total: {
      type: Number,
      required: [true, 'Order total is required'],
      min: 0
    },
    orderNumber: {
      type: Number,
      required: [true, 'Order number is required']
    },
    securityCode: {
      type: Number,
      required: [true, 'Order security code is required']
    },
    paymentMethod: {
      type: String,
      required: [true, 'Order payment method is required'],
      enum: {
        values: Object.values(OrderPaymentMethod),
        message: `Order payment method must be one of the following: ${Object.values(
          OrderPaymentMethod
        )}`
      }
    },
    shipment: {
      type: Boolean,
      required: [true, 'Order shipment is required']
    },
    address: {
      type: OrderAddressSchema,
      _id: false
    },
    status: {
      type: String,
      required: [true, 'Order status is required'],
      enum: {
        values: Object.values(OrderStatus),
        message: `Order status must be one of the following: ${Object.values(OrderStatus)}`
      }
    }
  },
  { versionKey: false, timestamps: true }
);

export const OrderModel = model<Order>('Order', OrderSchema);
