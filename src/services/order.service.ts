import { Service } from 'typedi';

// TODO
import {
  CABA_FREE_SHIPPING_MIN_SUBTOTAL_REQUIRED,
  CABA_SHIPPING_FEE,
  BUENOS_AIRES_FREE_SHIPPING_MIN_SUBTOTAL_REQUIRED,
  BUENOS_AIRES_SHIPPING_FEE,
  CASH_DISCOUNT_PERCENT
} from '../constants/Order';
import { IncorrectFormatError } from '../errors/base.error';

import { EmailService } from './email.service';
import { ModoService } from './modo.service';
import { AndreaniService } from './andreani.service';

import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';

import { Order, OrderItem, OrderPayer, User } from '../interfaces';
import {
  GetOrderShippingFee,
  OrderAddressCity,
  OrderPaymentMethod,
  OrderProduct,
  OrderShipment,
  OrderStatus,
  OrderTaxStatus
} from '../types/Order.types';
import { ObjectId } from '../types/ObjectId';

@Service({ transient: true })
export class OrderService {
  constructor(
    private readonly _emailService: EmailService,
    private readonly _modoService: ModoService,
    private readonly _andreaniService: AndreaniService,

    private readonly _orderRepository: OrderRepository,
    private readonly _productRepository: ProductRepository
  ) {}

  async getShippingFee(orderShipment: GetOrderShippingFee, productIds: ObjectId[]) {
    const { shipment, postalCode } = orderShipment;

    if (!shipment || !postalCode) {
      return 0;
    }

    const query = { _id: { $in: productIds } };
    const products = await this._productRepository.findMany(query);

    return this._andreaniService.getShippingFee(products, postalCode);
  }

  async createOrder(
    user: User,
    orderPayer: OrderPayer,
    orderItems: OrderProduct[],
    shipment: OrderShipment,
    paymentMethod: OrderPaymentMethod
  ) {
    // this.validateOrderPayer(orderPayer);

    // const { items, subtotal } = await this.createOrderItems(orderItems);
    // const shippingFee = this.getShippingFee(shipment, subtotal);
    // const discountSubtotal = subtotal + shippingFee;
    // const discount = this.getDiscount(paymentMethod, discountSubtotal);
    // const total = subtotal + shippingFee - discount;
    // const orderNumber = this.getOrderNumber();
    // const securityCode = this.getSecurityCode();

    // const newOrder = {
    //   user: user._id!,
    //   payer: orderPayer,
    //   items,
    //   subtotal,
    //   shippingFee,
    //   discount,
    //   total,
    //   orderNumber,
    //   securityCode,
    //   paymentMethod,
    //   shipment: shipment.shipment,
    //   address: shipment.address,
    //   status: OrderStatus.PENDING
    // } as Order;
    // await this.createOrderAndUpdateProducts(newOrder);
    // await this._emailService.sendNewOrderEmailToAdmin(user, newOrder);
    // await this._emailService.sendNewOrderEmailToCustomer(user, newOrder);
    // TODO: Payment Gateway
  }

  private validateOrderPayer(orderPayer: OrderPayer) {
    const { taxStatus, businessName } = orderPayer;

    if (taxStatus === OrderTaxStatus.REGISTERED_MANAGER && !businessName) {
      throw new IncorrectFormatError(
        `Business name must be present if payer tax status is ${OrderTaxStatus.REGISTERED_MANAGER}`
      );
    }
  }

  private async createOrderItems(orderItems: OrderProduct[]) {
    let subtotal = 0;
    let items: OrderItem[] = [];

    for (const item of orderItems) {
      const { _id: productId, amount } = item;
      const product = await this._productRepository.findById(productId);

      const { stock, name, image, price } = product;

      if (amount > stock) {
        throw new IncorrectFormatError(
          `Amount of product ${product._id!} can not be more than ${stock}`
        );
      }

      const orderItem = { productId, name, image: image!, price, amount };
      items.push(orderItem);

      subtotal += price * amount;
    }

    return { subtotal, items };
  }

  private getDiscount(paymentMethod: OrderPaymentMethod, subtotal: number) {
    if (paymentMethod !== OrderPaymentMethod.CASH) {
      return 0;
    }

    return (subtotal * CASH_DISCOUNT_PERCENT) / 100;
  }

  private getOrderNumber() {
    return Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
  }

  private getSecurityCode() {
    return Math.floor(Math.random() * (9999 - 1000) + 1000);
  }

  private async createOrderAndUpdateProducts(order: Order) {
    const session = await this._orderRepository.createSessionForTransaction();
    await session.withTransaction(async () => {
      await this._orderRepository.create(order);
      await this.updateSoldProducts(order);
    });
    session.endSession();
  }

  private async updateSoldProducts(order: Order) {
    const { items } = order;
    for (const item of items) {
      const { productId, amount } = item;
      const product = await this._productRepository.findById(productId);
      product.stock = product.stock - amount;

      await this._productRepository.update(product);
    }
  }
}
