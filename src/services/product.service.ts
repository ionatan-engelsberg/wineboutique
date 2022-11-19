import { Service } from 'typedi';
import uniqid from 'uniqid';

import { ProductRepository } from '../repositories/product.repository';

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
}
