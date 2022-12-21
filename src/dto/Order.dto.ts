import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { OrderAddressCity, OrderPaymentMethod, OrderTaxStatus } from '../types/Order.types';
import { UserJWT } from '../types/User.types';

export class CreateOrderItem {
  @IsString()
  _id!: string;

  @IsNumber()
  @Min(1)
  amount!: number;
}

// TODO: Take into account Specials
export class CreateOrderPayer {
  @IsString()
  // TODO: Max length
  firstName!: string;

  @IsString()
  // TODO: Max length
  lastName!: string;

  @IsNumber()
  identification!: number;

  @IsEnum(OrderTaxStatus)
  taxStatus!: OrderTaxStatus;

  @ValidateIf((body) => body.taxStatus === OrderTaxStatus.REGISTERED_MANAGER)
  @IsString()
  businessName!: string;
}

export class CreateOrderShipmentAddress {
  @IsEnum(OrderAddressCity)
  city!: OrderAddressCity;

  @IsString()
  locality!: string;

  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  floor!: string;

  @IsOptional()
  @IsString()
  apartment!: string;
}

export class CreateOrderShipment {
  @IsBoolean()
  shipment!: boolean;

  @ValidateIf((body) => body.shipment)
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderShipmentAddress)
  address!: CreateOrderShipmentAddress;
}

export class CreateOrderBody {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderItem)
  items!: CreateOrderItem[];

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderPayer)
  payer!: CreateOrderPayer;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderShipment)
  shipment!: CreateOrderShipment;

  @IsEnum(OrderPaymentMethod)
  paymentMethod!: OrderPaymentMethod;
}

export class CreateOrderDTO extends CreateOrderBody {
  @IsObject()
  userJWT!: UserJWT;
}
