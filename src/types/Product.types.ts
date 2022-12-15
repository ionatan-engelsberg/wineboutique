export enum ProductCategory {
  WINE = 'WINE',
  OIL = 'OIL',
  DISTILLED = 'DISTILLED'
}

export enum ProductFilters {
  BRAND = 'brand',
  GRAPE = 'grape',
  TYPE = 'type'
}

export interface ProductsAdditionalInfoObject {
  total?: number;

  withStock?: number;

  maxPrice?: number;

  minPrice?: number;

  brand?: string[];

  grape?: string[];

  type?: string[];
}

export enum GetProductsSort {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc'
}

export const GetProductsParsedSort = {
  [GetProductsSort.NAME_ASC]: { name: 1 },
  [GetProductsSort.NAME_DESC]: { name: -1 },
  [GetProductsSort.PRICE_ASC]: { price: 1 },
  [GetProductsSort.PRICE_DESC]: { price: -1 }
};

export enum ProductFiltersTypeEnum {
  ARRAY,
  MAX_VALUE,
  MIN_VALUE,
  REGEX,
  VALUE
}

export enum ProductFiltersType {
  brand = ProductFiltersTypeEnum.ARRAY,
  grape = ProductFiltersTypeEnum.ARRAY,
  type = ProductFiltersTypeEnum.ARRAY,
  maxPrice = ProductFiltersTypeEnum.MAX_VALUE,
  minPrice = ProductFiltersTypeEnum.MIN_VALUE,
  name = ProductFiltersTypeEnum.REGEX,
  category = ProductFiltersTypeEnum.VALUE
}

export const ProductPriceParsedKey = {
  maxPrice: 'price',
  minPrice: 'price'
};
