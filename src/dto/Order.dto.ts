import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
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
  @IsInt()
  postalCode!: number;

  @IsEnum(OrderAddressCity)
  city!: OrderAddressCity;

  @IsOptional() // TODO: Delete
  @IsString()
  locality!: string;

  @IsOptional() // TODO: Delete
  @IsString()
  street!: string;

  @IsOptional() // TODO: Delete
  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  floor!: string;

  @IsOptional()
  @IsString()
  apartment!: string;
}

export class OrderShipment {
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

  @IsOptional() // TODO: Delete
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderPayer)
  payer!: CreateOrderPayer;

  @IsOptional() // TODO: Delete
  @IsObject()
  @ValidateNested()
  @Type(() => OrderShipment)
  shipment!: OrderShipment;

  @IsOptional() // TODO: Delete
  @IsEnum(OrderPaymentMethod)
  paymentMethod!: OrderPaymentMethod;
}

export class CreateOrderDTO extends CreateOrderBody {
  @IsObject()
  userJWT!: UserJWT;
}

export class GetOrderShippingFeeDTO {
  @IsBoolean()
  shipment!: boolean;

  @Transform((value) => Number(value))
  @IsInt()
  postalCode!: number;

  @Transform((value) => value[0].split(',').map((val: string) => val.trim()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  productIds!: string[];
}
