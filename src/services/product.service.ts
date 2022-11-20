import { Service } from 'typedi';
import uniqid from 'uniqid';
import { omit } from 'lodash';

import { ProductRepository } from '../repositories/product.repository';

import { GetProductsFilters } from '../dto/Product.dto';
import { ProductFilters } from '../types/Product.types';

const DEFAULT_GET_PRODUCTS_LIMIT = 12;
const DEFAULT_SELECT_FIELDS = '-description -featuredInHome -outlined'; // TODO: Depending on UserRole

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

  async getProducts(filtersParams: GetProductsFilters) {
    const { offset: page } = filtersParams;

    const sort = { name: 1 }; // TODO
    const limit = DEFAULT_GET_PRODUCTS_LIMIT;
    const offset = (page - 1) * limit;
    const selectFields = DEFAULT_SELECT_FIELDS;

    const filters = this.getFilters(filtersParams);
    const aggregateQuery = this.getAggregateQuery(filters);

    const productsFilters = { ...filters, stock: { $gt: 0 } };

    const { total, withStock, ...uniqueFilters } = await this.getFiltersInfo(aggregateQuery);
    const products = await this.getFilteredProducts(
      productsFilters,
      sort,
      offset,
      limit,
      selectFields,
      withStock
    );
    const totalPages = Math.ceil(total / limit);

    return { totalPages, filters: uniqueFilters, products };
  }

  private getAggregateQuery(filters: any /* TODO */) {
    const match = { $match: { ...filters } };

    const filterValues = Object.values(ProductFilters);
    const uniqueFilters = this.getUniqueFilters(filterValues);
    const countFilters = this.getCountFilters();

    const filtersInfo = {
      $group: {
        _id: 'filters',
        ...uniqueFilters,
        ...countFilters
      }
    };

    return [match, filtersInfo];
  }

  private getUniqueFilters(filters: ProductFilters[]) {
    const addToSetObject: any = {};
    filters.forEach((key) => {
      addToSetObject[key] = { $addToSet: `$${key}` };
    });

    return addToSetObject;
  }

  private getCountFilters() {
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
    return {};
  }

  private async getFilteredProducts(
    filters: any,
    sort: any,
    offset: number,
    limit: number,
    selectFields: string,
    withStockAmount: number
  ) {
    const productsWithStock = await this._productRepository.getProducts(
      filters,
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
    if (withStockAmount - offset < limit) {
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
}
