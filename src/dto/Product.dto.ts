import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

import { GetProductsSort } from '../types/Product.types';
import { UserJWT } from '../types/User.types';
import { getCurrentDate } from '../utils/getCurrentDate';

export class GetProductsFilters {
  @IsNumber()
  @Min(1)
  page!: number;

  @IsEnum(GetProductsSort)
  sort!: GetProductsSort;

  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim().toUpperCase()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  grape?: string[];

  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim().toUpperCase()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  brand?: string[];

  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim().toUpperCase()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  region?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Transform((value) => value[0].split(',').map((val: string) => Number(val)))
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(getCurrentDate().getFullYear(), { each: true })
  year?: number[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim().toUpperCase()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  type?: string;

  @IsOptional()
  @Transform((value) => value.trim().toUpperCase())
  @IsString()
  name?: string;
}

export class GetProductsDTO {
  @IsObject()
  filters!: GetProductsFilters;

  @IsOptional()
  @IsObject()
  userJWT?: UserJWT;
}

export class GetProductByIdDTO {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsObject()
  userJWT?: UserJWT;
}
