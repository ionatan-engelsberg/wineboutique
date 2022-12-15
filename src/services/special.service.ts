import { Service } from 'typedi';
import { Special } from '../interfaces';

import { SpecialRepository } from '../repositories/special.repository';
import { ObjectId } from '../types/ObjectId';

import { SpecialCategory } from '../types/Special.types';
import { getCurrentDate } from '../utils/getCurrentDate';

// TODO: DELETE
const testProducts = [
  {
    productId: '63963e219c887b921db9cdf0',
    name: 'BZ1PACLBJTMYW0',
    price: 10
  },
  {
    productId: '63963e219c887b921db9cdf2',
    name: 'BZ1PACLBJTMZ1Q',
    price: 20
  },
  {
    productId: '63963e219c887b921db9cdf4',
    name: 'BZ1PACLBJTMZ71',
    price: 30
  },
  {
    productId: '63963e229c887b921db9cdf6',
    name: 'BZ1PACLBJTMZCB',
    price: 40
  },
  {
    productId: '63963e229c887b921db9cdf8',
    name: 'BZ1PACLBJTMZHG',
    price: 50
  },
  {
    productId: '63963e229c887b921db9cdfa',
    name: 'BZ1PACLBJTMZMQ',
    price: 60
  },
  {
    productId: '63963e229c887b921db9cdfc',
    name: 'BZ1PACLBJTMZRX',
    price: 70
  },
  {
    productId: '63963e229c887b921db9cdfe',
    name: 'BZ1PACLBJTMZX5',
    price: 80
  },
  {
    productId: '63963e239c887b921db9ce00',
    name: 'BZ1PACLBJTN029',
    price: 90
  },
  {
    productId: '63963e239c887b921db9ce02',
    name: 'BZ1PACLBJTN07D',
    price: 100
  },
  {
    productId: '63963e239c887b921db9ce04',
    name: 'BZ1PACLBJTN0CG',
    price: 110
  },
  {
    productId: '63963e239c887b921db9ce06',
    name: 'BZ1PACLBJTN0HJ',
    price: 120
  },
  {
    productId: '63963e239c887b921db9ce08',
    name: 'BZ1PACLBJTN0ML',
    price: 130
  },
  {
    productId: '63963e249c887b921db9ce0a',
    name: 'BZ1PACLBJTN0RR',
    price: 140
  },
  {
    productId: '63963e249c887b921db9ce0c',
    name: 'BZ1PACLBJTN0WT',
    price: 150
  },
  {
    productId: '63963e249c887b921db9ce0e',
    name: 'BZ1PACLBJTN11W',
    price: 160
  },
  {
    productId: '63963e249c887b921db9ce10',
    name: 'BZ1PACLBJTN16Z',
    price: 170
  },
  {
    productId: '63963e249c887b921db9ce12',
    name: 'BZ1PACLBJTN1C5',
    price: 180
  },
  {
    productId: '63963e249c887b921db9ce14',
    name: 'BZ1PACLBJTN1H8',
    price: 190
  },
  {
    productId: '63963e259c887b921db9ce16',
    name: 'BZ1PACLBJTN1MF',
    price: 200
  }
];

@Service({ transient: true })
export class SpecialService {
  constructor(private readonly _specialRepository: SpecialRepository) {}

  // TODO: Temporal
  async createTestSpecials(category: SpecialCategory) {
    if (category === SpecialCategory.OPPORTUNITY_BOX) {
      return this.createTestOpportunities();
    } else {
      return this.createTestTastings();
    }
  }

  // TODO: Temporal
  private async createTestOpportunities() {
    let i = 0;
    let j = 0;

    while (i < 5) {
      const category = SpecialCategory.OPPORTUNITY_BOX;
      const stock = i + 1;
      const price = 350 * (i + 1);
      const title = `Caja de oportunidad ${i + 1}`;
      const description = `Esta es la descripción de prueba para la caja de oportunidad con título "${title}"`;

      const products: any = [];

      let h = 0;
      while (h < i + 1) {
        const product = testProducts[j];
        products.push(product);

        j += 1;
        h += 1;
      }

      const singleOpportunity: Special = {
        category,
        stock,
        price,
        products,
        description,
        title
      };

      await this._specialRepository.create(singleOpportunity);

      i += 1;
    }
  }

  // TODO: Temporal
  private async createTestTastings() {
    let i = 0;
    let j = 0;

    while (i < 5) {
      const category = SpecialCategory.TASTING;
      const stock = (i + 1) * 2;
      const price = 4250 * (i + 1);
      const date = getCurrentDate();

      const products: any = [];

      let h = 0;
      while (h < i + 1) {
        const product = testProducts[j];
        products.push(product);

        j += 1;
        h += 1;
      }

      const singleOpportunity: Special = {
        category,
        stock,
        price,
        products,
        date
      };

      await this._specialRepository.create(singleOpportunity);

      i += 1;
    }
  }

  async getAllSpecialsOfACategory(category: SpecialCategory) {
    return this._specialRepository.findMany({ category, stock: { $gt: 0 } });
  }

  async getManySpecialsOfACategoryByIds(category: SpecialCategory, specialIds: ObjectId[]) {
    const filterQuery = { _id: { $in: specialIds }, category };
    return this._specialRepository.findMany(filterQuery);
  }
}
