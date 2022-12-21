import { Service } from 'typedi';
import axios from 'axios';

import {
  ANDREANI_USERNAME,
  ANDREANI_PASSWORD,
  ANDREANI_BASE_URL,
  ANDREANI_CLIENT_NUMBER,
  ANDREANI_CREDENTIAL
} from '../config/config';

import { Product } from '../interfaces';

// TODO
const SUCURSAL_ORIGEN = 'PAL';

@Service({ transient: true })
export class AndreaniService {
  constructor() {}

  private async getAccessToken() {
    const stringToEncode = `${ANDREANI_USERNAME}:${ANDREANI_PASSWORD}`;
    const encodedString = btoa(stringToEncode);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedString}`
      }
    };

    const response = await axios.get('', config);

    const {
      data: { token }
    } = response;

    return token;
  }

  async getShippingFee(products: Product[], postalCode: number) {
    const params = {
      cpDestino: postalCode,
      contrato: ANDREANI_CREDENTIAL,
      cliente: ANDREANI_CLIENT_NUMBER,
      sucursalOrigen: SUCURSAL_ORIGEN
    };

    let i = 0;
    products.forEach((prod: Product) => {
      const { weight, volume } = prod;

      params[`bultos[${i}][volumen]`] = (i + 1) * 5000; // TODO
      params[`bultos[${i}][kilos]`] = i + 1; // TODO

      i += 1;
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    };

    console.log('PARAMS: ', params);

    try {
      const response = await axios.get(`${ANDREANI_BASE_URL}/v1/tarifas`, config);
      console.log('RESPONSE: ', response.data);

      const {
        tarifaConIva: { total }
      } = response.data;

      return total;
    } catch (error: any) {
      console.log('ERROR: ', error.response.data);
      return {};
    }
  }
}
