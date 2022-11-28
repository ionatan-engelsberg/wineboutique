export enum ProductFilters {
  BRAND = 'brand',
  GRAPE = 'grape',
  YEAR = 'year',
  REGION = 'region',
  TYPE = 'type'
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
  REGEX
}

export enum ProductFiltersType {
  brand = ProductFiltersTypeEnum.ARRAY,
  grape = ProductFiltersTypeEnum.ARRAY,
  year = ProductFiltersTypeEnum.ARRAY,
  region = ProductFiltersTypeEnum.ARRAY,
  type = ProductFiltersTypeEnum.ARRAY,
  maxPrice = ProductFiltersTypeEnum.MAX_VALUE,
  minPrice = ProductFiltersTypeEnum.MIN_VALUE,
  name = ProductFiltersTypeEnum.REGEX
}

export const ProductPriceParsedKey = {
  maxPrice: 'price',
  minPrice: 'price'
};
