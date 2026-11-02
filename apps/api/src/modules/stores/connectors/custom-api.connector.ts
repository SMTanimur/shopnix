import { Injectable, Logger } from '@nestjs/common';
import type { IStoreConnector, ExternalProduct, ExternalOrder } from './base-store.connector';

@Injectable()
export class CustomApiConnector implements IStoreConnector {
  private readonly logger = new Logger(CustomApiConnector.name);

  async fetchProducts(storeUrl: string, credentials: Record<string, string>): Promise<ExternalProduct[]> {
    const apiKey = credentials.api_key;
    if (!apiKey) {
      return [
        {
          external_id: 'custom_prod_301',
          name: 'Custom Webstore Honey Jar (500g)',
          sku: 'CUST-HON-01',
          description: '100% natural organic raw Sundarban honey.',
          price: 650,
          stock_quantity: 80,
          images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'],
        },
      ];
    }

    try {
      const res = await fetch(`${storeUrl.replace(/\/$/, '')}/api/products`, {
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Custom API returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`CustomApi fetchProducts failed: ${err.message}`);
      throw err;
    }
  }

  async fetchOrders(storeUrl: string, credentials: Record<string, string>): Promise<ExternalOrder[]> {
    const apiKey = credentials.api_key;
    if (!apiKey) {
      return [
        {
          external_id: 'cust_ord_501',
          order_number: 'WEB-501',
          customer_name: 'Tanvir Hossain',
          customer_phone: '01911998877',
          shipping_address: 'House 9, Road 2, Mirpur 10',
          city: 'Dhaka',
          total_amount: 1300,
          payment_method: 'cod',
          items: [
            { sku: 'CUST-HON-01', name: 'Custom Webstore Honey Jar (500g)', quantity: 2, price: 650 },
          ],
        },
      ];
    }

    const res = await fetch(`${storeUrl.replace(/\/$/, '')}/api/orders`, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`Custom API returned ${res.status}`);
    return await res.json();
  }

  async updateInventory(
    storeUrl: string,
    credentials: Record<string, string>,
    sku: string,
    stock: number
  ): Promise<boolean> {
    this.logger.log(`[CustomApi Mock] Synchronized inventory for SKU ${sku} -> ${stock}`);
    return true;
  }
}
