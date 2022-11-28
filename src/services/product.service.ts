import { Service } from 'typedi';
import uniqid from 'uniqid';
import { omit } from 'lodash';

import { IncorrectFormatError, NotFoundError } from '../errors/base.error';

import { ProductRepository } from '../repositories/product.repository';

import { GetProductsFilters } from '../dto/Product.dto';
import {
  GetProductsParsedSort,
  ProductFilters,
  ProductFiltersType,
  ProductFiltersTypeEnum,
  ProductPriceParsedKey
} from '../types/Product.types';
import { ObjectId } from '../types/ObjectId';
import { UserJWT, UserRole } from '../types/User.types';

const DEFAULT_GET_PRODUCTS_LIMIT = 12;
const DEFAULT_SELECT_FIELDS = '-description -featuredInHome -outlined';
const ROLE_USER_SELECT_FIELDS = '';

@Service({ transient: true })
export class ProductService {
  constructor(private readonly _productRepository: ProductRepository) {}

  // TODO: Temporal
  async createTestProducts() {
    const brands = ['zuccardi', 'angelica zapata', 'bramare', 'amar y vivir'];
    const grapes = ['malbec', 'pinot noir', 'cabernet sauvignon', 'cabernet franc', 'blend'];
    const types = ['tinto', 'blanco', 'rosado', 'champagne'];
    const regions = ['mendoza', 'misiones', 'calafate'];

    let i = 0;
    while (i < 50) {
      const price = 10 * (i + 1);
      const name = uniqid();
      const description = uniqid();
      const brand = brands[i % 4];
      const grape = grapes[i % 5];
      const year = i % 4 !== 0 ? 2020 - (i % 4) : undefined;
      const type = types[i % 4];
      const outlined = i % 10 === 0;
      const featuredInHome = i % 10 === 0;
      const region = i % 4 !== 0 ? regions[i - 1] : undefined;
      const stock = (i % 4) ** 2;

      const product = {
        price,
        name,
        description,
        brand,
        grape,
        year,
        type,
        outlined,
        featuredInHome,
        region,
        stock
      };

      await this._productRepository.create(product);
      i += 1;
    }
  }

  async getProducts(receivedFilters: GetProductsFilters, user?: UserJWT) {
    const { page, sort: receivedSort, ...filterParams } = receivedFilters;

    const sort = GetProductsParsedSort[receivedSort];
    const limit = DEFAULT_GET_PRODUCTS_LIMIT;
    const offset = (page - 1) * limit;
    const selectFields =
      user && user.role !== UserRole.USER ? ROLE_USER_SELECT_FIELDS : DEFAULT_SELECT_FIELDS;

    const filters = this.getFilters(filterParams as GetProductsFilters);
    const aggregateQuery = this.getAggregateQuery(filters);

    const { total, withStock, ...uniqueFilters } = await this.getFiltersInfo(aggregateQuery);
    const products = await this.getFilteredProducts(
      filters,
      sort,
      offset,
      limit,
      selectFields,
      withStock
    );
    const totalPages = Math.ceil(total / limit);

    return { totalPages, filters: uniqueFilters, products };
  }

  private getAggregateQuery(filters: Object) {
    const match = { $match: { ...filters } };

    const filterValues = Object.values(ProductFilters);
    const uniqueFilters = this.getUniqueFiltersAggregation(filterValues);
    const countFilters = this.getCountFiltersAggregation();

    const filtersInfo = {
      $group: {
        _id: 'filters',
        ...uniqueFilters,
        ...countFilters
      }
    };

    return [match, filtersInfo];
  }

  private getUniqueFiltersAggregation(filters: ProductFilters[]) {
    const addToSetObject: any = {};
    filters.forEach((key) => {
      addToSetObject[key] = { $addToSet: `$${key}` };
    });

    return addToSetObject;
  }

  private getCountFiltersAggregation() {
    const withStock = {
      withStock: { $sum: { $cond: { if: { $gt: ['$stock', 0] }, then: 1, else: 0 } } }
    };
    const total = { total: { $count: {} } };

    return { ...withStock, ...total };
  }

  private async getFiltersInfo(aggregateQuery: Object[]) {
    const rawFilters = await this._productRepository.getProductsFilters(aggregateQuery);
    return omit(rawFilters[0], '_id');
  }

  private getFilters(filtersParams: GetProductsFilters) {
    const receivedFilters = Object.entries(filtersParams);
    const filters = {};

    receivedFilters.forEach((filter) => {
      const key = filter[0];
      const value = filter[1];

      const keyType = ProductFiltersType[key];

      switch (keyType) {
        case ProductFiltersTypeEnum.ARRAY: {
          filters[key] = { $in: value };
          break;
        }
        case ProductFiltersTypeEnum.MAX_VALUE: {
          // TODO: Receive "pice" object ( { min: number: max: number } )
          const parsedKey = ProductPriceParsedKey[key];
          filters[parsedKey] = { ...filters[parsedKey], $lte: value };
          break;
        }
        case ProductFiltersTypeEnum.MIN_VALUE: {
          // TODO: Receive "pice" object ( { min: number: max: number } )
          const parsedKey = ProductPriceParsedKey[key];
          filters[parsedKey] = { $gte: value };
          break;
        }
        case ProductFiltersTypeEnum.REGEX: {
          filters[key] = { $regex: `${value}` };
          break;
        }
        default:
          // TODO: Internal server error
          throw new IncorrectFormatError(`Incorrect keyType ${keyType}`);
      }
    });

    return filters;
  }

  private async getFilteredProducts(
    filters: any,
    sort: any,
    offset: number,
    limit: number,
    selectFields: string,
    withStockAmount: number
  ) {
    const productsWithStockFilters = { ...filters, stock: { $gt: 0 } };
    const productsWithStock = await this._productRepository.getProducts(
      productsWithStockFilters,
      sort,
      offset,
      limit,
      selectFields
    );
    const productsWithNoStock = await this.getProductsWithNoStock(
      filters,
      sort,
      offset,
      limit,
      selectFields,
      withStockAmount
    );

    const products = [...productsWithStock, ...productsWithNoStock];

    if (products.length === 0) {
      throw new NotFoundError('Products with rovided properties do not exist');
    }

    return products;
  }

  private async getProductsWithNoStock(
    filters: any,
    sort: any,
    offset: number,
    limit: number,
    selectFields: string,
    withStockAmount: number
  ) {
    if (withStockAmount - offset >= limit) {
      return [];
    }

    const productsWitNoStockFilters = { ...filters, stock: 0 };

    const difference = withStockAmount - offset;
    const newOffset = difference > 0 ? 0 : -difference;
    const newLimit = difference > 0 ? limit - difference : limit;

    return this._productRepository.getProducts(
      productsWitNoStockFilters,
      sort,
      newOffset,
      newLimit,
      selectFields
    );
  }

  async getProductById(productId: ObjectId, user?: UserJWT) {
    const selectFields =
      user && user.role !== UserRole.USER ? ROLE_USER_SELECT_FIELDS : DEFAULT_SELECT_FIELDS;

    return this._productRepository.findById(productId, selectFields);
  }

  async getManyProductsByIds(productIds: ObjectId[]) {
    const filterQuery = { _id: { $in: productIds } };

    return this._productRepository.findMany(filterQuery);
  }
}
