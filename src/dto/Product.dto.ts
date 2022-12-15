import { Transform } from 'class-transformer';
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
  ValidateIf
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

  @IsOptional()
  @Transform((value) => value[0].split(',').map((val: string) => val.trim()))
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  specialIds!: string[];
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

export class CreateProductBody {
  @IsEnum(ProductCategory)
  category!: ProductCategory;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform((value) => Number(value)) // TODO: Delete if when sending it from frontend value is already a number
  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  brand!: string;

  @ValidateIf((body) => body.category === ProductCategory.WINE)
  @IsString()
  grape!: string;

  @ValidateIf((body) => body.category === ProductCategory.WINE)
  @IsString()
  type!: string;

  @Transform((value) => Boolean(value)) // TODO: Delete if when sending it from frontend value is already a boolean value
  @IsBoolean()
  featuredInHome!: boolean;

  @Transform((value) => Number(value)) // TODO: Delete if when sending it from frontend value is already a number
  @IsInt()
  @Min(0)
  stock!: number;
}

export class CreateProductDTO extends CreateProductBody {
  @IsString()
  image!: string;

  @IsString()
  imageId!: string;
}

export class DeleteProductDTO {
  @IsString()
  productId!: string;
}
