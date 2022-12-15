import { Service } from 'typedi';
import uniqid from 'uniqid';
import { omit } from 'lodash';

import { ConflictError, IncorrectFormatError, NotFoundError } from '../errors/base.error';

import { SpecialService } from './special.service';
import { CloudinaryService } from './cloudinary.service';

import { ProductRepository } from '../repositories/product.repository';

import {
  GetFeaturedProductsFilters,
  GetAvailableFilters,
  GetProductsFilters
} from '../dto/Product.dto';
import {
  ProductsAdditionalInfoObject,
  GetProductsParsedSort,
  ProductFilters,
  ProductFiltersType,
  ProductFiltersTypeEnum,
  ProductPriceParsedKey,
  ProductCategory
} from '../types/Product.types';
import { ObjectId } from '../types/ObjectId';
import { UserJWT, UserRole } from '../types/User.types';
import { Product, Special } from '../interfaces';
import { SpecialCategory } from '../types/Special.types';
import { logErrors } from '../utils/logger';

const DEFAULT_GET_PRODUCTS_LIMIT = 12;
const DEFAULT_SELECT_FIELDS = '-description -featuredInHome -outlined';
const ROLE_USER_SELECT_FIELDS = '';

@Service({ transient: true })
export class ProductService {
  constructor(
    private readonly _specialService: SpecialService,
    private readonly _cloudinaryService: CloudinaryService,

    private readonly _productRepository: ProductRepository
  ) {}

  // TODO: Temporal
  async createTestProducts() {
    const brands = ['zuccardi', 'angelica zapata', 'bramare', 'amar y vivir', 'rutini', 'chacra'];
    const grapes = [
      'malbec',
      'pinot noir',
      'cabernet sauvignon',
      'cabernet franc',
      'blend',
      'syrah'
    ];
    const types = ['tinto', 'blanco', 'rosado', 'champagne'];

    let i = 0;
    while (i < 100) {
      const price = 10 * (i + 1);
      const name = uniqid();
      const description = uniqid();
      const category = i % 5 === 0 ? ProductCategory.OIL : ProductCategory.WINE;
      const brand = brands[i % 6];
      const grape = category === ProductCategory.OIL ? 'oil' : grapes[i % 6];
      const type = category === ProductCategory.OIL ? 'oil' : types[i % 4];
      const featuredInHome = i % 10 === 0;
      const stock = (i % 4) ** 2;

      const product: Product = {
        price,
        name,
        description,
        brand,
        grape,
        type,
        featuredInHome,
        stock,
        category
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
    const { total, withStock } = await this.getProductsCount(filters);

    const products = await this.getFilteredProducts(
      filters,
      sort,
      offset,
      limit,
      selectFields,
      withStock!
    );
    const totalPages = Math.ceil(total! / limit);

    return { totalPages, products };
  }

  private async getProductsCount(filters: Object) {
    const countQuery = this.getStockCountQuery();
    const query = this.getGroupAggregation(filters, { ...countQuery });

    const { total, withStock } = await this.getProductsAdditionalInfo(query);

    return { total, withStock };
  }

  private getStockCountQuery() {
    const withStock = {
      withStock: { $sum: { $cond: { if: { $gt: ['$stock', 0] }, then: 1, else: 0 } } }
    };
    const total = { total: { $count: {} } };

    return { ...withStock, ...total };
  }

  async getAvailableFilters(receivedFilters: GetAvailableFilters) {
    const filters = this.getFilters(receivedFilters);

    const setQuery = this.getSetQuery();
    const priceQuery = this.getPriceQuery();

    const query = this.getGroupAggregation(filters, { ...setQuery, ...priceQuery });

    const availableFilters = await this.getProductsAdditionalInfo(query);

    return { filters: availableFilters };
  }

  private getSetQuery() {
    const filterKeys = Object.values(ProductFilters);
    const addToSetObject: any = {};

    filterKeys.forEach((key) => {
      addToSetObject[key] = { $addToSet: `$${key}` };
    });

    return addToSetObject;
  }

  private getPriceQuery() {
    const maxPriceQuery = { maxPrice: { $max: '$price' } };
    const minPriceQuery = { minPrice: { $min: '$price' } };

    return { ...maxPriceQuery, ...minPriceQuery };
  }

  private getGroupAggregation(filters: Object, aggregationQuery: Object) {
    const match = { $match: { ...filters } };

    const filtersInfo = {
      $group: {
        _id: 'filters',
        ...aggregationQuery
      }
    };

    return [match, filtersInfo];
  }

  private async getProductsAdditionalInfo(aggregateQuery: Object[]) {
    const rawInfo = await this._productRepository.getProductsAdditionalInfo(aggregateQuery);
    const parsedInfo = omit(rawInfo[0], '_id');

    const filtersObject: ProductsAdditionalInfoObject = {};
    for (const filterKey in parsedInfo) {
      const values = parsedInfo[filterKey];

      // TODO
      if (values.length > 1 || typeof values === 'number') {
        filtersObject[filterKey] = values;
      }
    }

    return filtersObject;
  }

  private getFilters(filtersParams: GetProductsFilters | GetAvailableFilters) {
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
        case ProductFiltersTypeEnum.VALUE: {
          filters[key] = value;
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

  async getManyProductsByIds(productIds: ObjectId[], specialIds: ObjectId[]) {
    const filterQuery = { _id: { $in: productIds } };
    const products = await this._productRepository.findMany(filterQuery);
    const specials = await this._specialService.getManySpecialsOfACategoryByIds(
      SpecialCategory.OPPORTUNITY_BOX,
      specialIds
    );

    const productObject = this.getParsedProductsObject(products, specials);

    return productObject;
  }

  private getParsedProductsObject(products: Product[], specials: Special[]) {
    const productObject: { wines: Product[]; oils: Product[] } = { wines: [], oils: [] };

    const wines: Product[] = [];
    const oils: Product[] = [];

    products.forEach((prod) => {
      // TODO: Add destilado condition when adding that category
      if (prod.category === ProductCategory.WINE) {
        wines.push(prod);
      } else {
        oils.push(prod);
      }
    });

    const specialsObject = { opportunityBoxes: specials };

    productObject.wines = wines;
    productObject.oils = oils;

    return { ...productObject, ...specialsObject };
  }

  async getFeaturedProducts(filters: GetFeaturedProductsFilters, user?: UserJWT) {
    const selectFields =
      user && user.role !== UserRole.USER ? ROLE_USER_SELECT_FIELDS : DEFAULT_SELECT_FIELDS;
    const options = { fields: selectFields };

    const parsedFilters = { ...filters, stock: { $gt: 0 } };

    return this._productRepository.findMany(parsedFilters, options);
  }

  async createProduct(product: Product) {
    await this.validateExistingProduct(product);

    product = this.getParsedProduct(product);

    return this._productRepository.create(product);
  }

  private getParsedProduct(product: Product) {
    // TODO: Make it more generic
    if (product.category === ProductCategory.OIL) {
      // TODO: Define 'OIL' as a constant
      product.grape = 'OIL';
      product.type = 'OIL';
    }

    return product;
  }

  private async validateExistingProduct(product: Product) {
    let existingProduct: Product;

    try {
      const { name } = product;
      existingProduct = await this._productRepository.findOne({ name });

      if (existingProduct) {
        throw new ConflictError(`Product with name ${name} already exists`, [
          { productId: existingProduct._id }
        ]);
      }
    } catch (error: any) {
      if (error.details) {
        throw error;
      }
    }
  }

  async deleteProduct(productId: ObjectId) {
    const product = await this._productRepository.findById(productId);

    const { imageId } = product;

    await this._productRepository.deleteById(productId);

    if (imageId) {
      try {
        await this._cloudinaryService.deleteImage(imageId);
      } catch (error) {
        logErrors(error);
      }
    }
  }
}
