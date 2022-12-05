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
