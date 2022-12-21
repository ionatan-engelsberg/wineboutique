import { Service } from 'typedi';
import axios from 'axios';

import { MODO_BASE_URL, MODO_USER, MODO_PASSWORD, MODO_STORE_ID } from '../config/config';

@Service({ transient: true })
export class ModoService {
  constructor() {}

  // TODO: Delete
  async createTestOrder() {
    const accessToken = await this.generateModoAccessToken();

    const body = {
      productName: 'TEST PRODUCT',
      price: 10,
      quantity: 1,
      storeId: MODO_STORE_ID,
      currency: 'ARS', // TODO: Constant
      externalIntentionId: '1234' // TODO: OrderId (NOT MONGO)
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    const response = await axios.post(
      `${MODO_BASE_URL}/merchants/ecommerce/payment-intention`,
      body,
      config
    );

    return response.data;
  }

  private async generateModoAccessToken() {
    const body = {
      username: MODO_USER,
      password: MODO_PASSWORD
    };

    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios.post(`${MODO_BASE_URL}/merchants/middleman/token`, body, config);
    const {
      data: { accessToken }
    } = response;

    return accessToken;
  }
}
