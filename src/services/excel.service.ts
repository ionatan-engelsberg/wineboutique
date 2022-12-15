import { Service } from 'typedi';
import xlsx from 'xlsx';

import { IncorrectFormatError } from '../errors/base.error';
import { ExcelProduct, ParsedExcelProduct } from '../types/Product.types';

const uploadsSource = `${__dirname}/../../uploads`;

@Service({ transient: true })
export class ExcelService {
  constructor() {}

  importProductsExcel(filename: string) {
    const file = xlsx.readFile(`${uploadsSource}/${filename}`);
    const nameSheets = file.SheetNames;

    if (nameSheets.length > 1) {
      throw new IncorrectFormatError('File can only have one sheet');
    }

    const rawProducts: ExcelProduct[] = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    const products = rawProducts.map((product: ExcelProduct) => {
      const { Nombre: name, Tipo: type, Bodega: brand, Cepa: grape, 'Link foto': image } = product;
      return { name, type, brand, grape, image } as ParsedExcelProduct;
    });

    return products;
  }
}
