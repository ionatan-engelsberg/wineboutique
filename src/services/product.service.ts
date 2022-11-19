import { Service } from 'typedi';
import uniqid from 'uniqid';
import { omit } from 'lodash';

import { ProductRepository } from '../repositories/product.repository';

import { GetProductsFilters } from '../dto/Product.dto';
import { ProductFilters } from '../types/Product.types';

const DEFAULT_GET_PRODUCTS_LIMIT = 12;
const DEFAULT_SELECT_FIELDS = '-description -featuredInHome -outlined';

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

  async getProducts(filtersParams?: GetProductsFilters) {
    const sort = { name: 1 }; // TODO
    const limit = DEFAULT_GET_PRODUCTS_LIMIT;
    const offset = 1 * limit; // TODO
    const selectFields = DEFAULT_SELECT_FIELDS;

    const filters = this.getFilters(filtersParams!);
    const addToSetObject = this.getAddToSetFilter();

    const productsFilters = { ...filters, stock: { $gt: 0 } };

    const totalCount = await this._productRepository.countDocuments(filters);
    const setFilters = await this.getSetFilters(filters, addToSetObject);
    const products = await this.getFilteredProducts(
      productsFilters,
      limit,
      sort,
      offset,
      selectFields
    );

    return { count: totalCount, filters: setFilters, products };
  }

  private getAddToSetFilter() {
    const filterKeys = Object.values(ProductFilters);
    const addToSetObject: any = {};
    filterKeys.forEach((key) => {
      addToSetObject[key] = { $addToSet: `$${key}` };
    });

    return addToSetObject;
  }

  private async getSetFilters(filters: any /* TODO */, addToSetObject: Object) {
    const rawFilters = await this._productRepository.getProductsFilters(filters, addToSetObject);
    return omit(rawFilters[0], '_id');
  }

  private getFilters(filtersParams: GetProductsFilters) {
    return { price: { $lte: 300 } };
  }

  private async getFilteredProducts(
    filters: any,
    limit: number,
    sort: any,
    offset: number,
    selectFields: string
  ) {
    let products = await this._productRepository.getProducts(
      filters,
      limit,
      sort,
      selectFields,
      offset
    );

    if (products.length < limit) {
      const productsWithNoStock = await this.getProductsWithNoStock(products.length, filters, sort);

      products = [...products, ...productsWithNoStock];
    }

    return products;
  }

  private async getProductsWithNoStock(productsLength: number, filters: any, sort: any) {
    const limit = DEFAULT_GET_PRODUCTS_LIMIT;
    const productsWithNoStockLimit = limit - productsLength;
    const productsWitNoStockFilters = { ...filters, stock: 0 };

    return this._productRepository.getProducts(
      productsWitNoStockFilters,
      productsWithNoStockLimit,
      sort,
      DEFAULT_SELECT_FIELDS
    );
  }
}
