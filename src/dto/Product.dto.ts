import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

import { GetProductsSort, ProductCategory } from '../types/Product.types';
import { UserJWT } from '../types/User.types';

export class GetProductsFilters {
  @IsNumber()
  @Min(1)
  page!: number;

  @IsEnum(GetProductsSort)
  sort!: GetProductsSort;

  @IsEnum(ProductCategory)
  category!: ProductCategory;

  // TODO: ValidateIf
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
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  // TODO: ValidateIf
  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim().toUpperCase()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  type?: string[];

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

export class GetManyProductsByIdsDTO {
  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  productIds!: string[];
}

export class GetFeaturedProductsFilters {
  @IsBoolean()
  featuredInHome!: boolean;
}

export class GetFeaturedProductsDTO {
  @IsObject()
  filters!: GetFeaturedProductsFilters;

  @IsOptional()
  @IsObject()
  userJWT?: UserJWT;
}

export class GetAvailableFilters {
  @IsEnum(ProductCategory)
  category!: ProductCategory;
}

export class GetAvailableFiltersDTO {
  @IsObject()
  filters!: GetAvailableFilters;
}
