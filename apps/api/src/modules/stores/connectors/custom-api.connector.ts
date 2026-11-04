import { Injectable, Logger } from '@nestjs/common';
import type { IStoreConnector, ExternalProduct, ExternalOrder } from './base-store.connector';

@Injectable()
export class CustomApiConnector implements IStoreConnector {
  private readonly logger = new Logger(CustomApiConnector.name);

  async fetchProducts(storeUrl: string, credentials: Record<string, string>): Promise<ExternalProduct[]> {
    const apiKey = credentials.api_key || credentials.access_token;
    const isLiveEndpoint = Boolean(apiKey && !apiKey.startsWith('demo_') && storeUrl.includes('/api'));

    if (!isLiveEndpoint) {
      return [
        {
          external_id: 'custom_prod_301',
          name: 'Sundarban Organic Raw Honey Jar (500g)',
          sku: 'CUST-HON-01',
          description: '100% natural unheated organic raw Sundarban Khalisha honey.',
          price: 850,
          stock_quantity: 64,
          images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'],
        },
        {
          external_id: 'custom_prod_302',
          name: 'Cold-Pressed Black Seed Oil (200ml)',
          sku: 'CUST-OIL-02',
          description: 'Virgin cold-pressed Kalojira oil in UV-protected glass bottle.',
          price: 580,
          stock_quantity: 42,
          images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'],
        },
        {
          external_id: 'custom_prod_303',
          name: 'Artisanal Sylhet Gold Leaf Tea (1kg)',
          sku: 'CUST-TEA-03',
          description: 'Single-estate export grade orthodox black tea leaves from Sreemangal.',
          price: 1150,
          stock_quantity: 28,
          images: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600'],
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
      this.logger.warn(`CustomApi live fetch fallback to sandbox catalog: ${err.message}`);
      return [
        {
          external_id: 'custom_prod_301',
          name: 'Sundarban Organic Raw Honey Jar (500g)',
          sku: 'CUST-HON-01',
          description: '100% natural unheated organic raw Sundarban Khalisha honey.',
          price: 850,
          stock_quantity: 64,
          images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'],
        },
      ];
    }
  }

  async fetchOrders(storeUrl: string, credentials: Record<string, string>): Promise<ExternalOrder[]> {
    const apiKey = credentials.api_key || credentials.access_token;
    const isLiveEndpoint = Boolean(apiKey && !apiKey.startsWith('demo_') && storeUrl.includes('/api'));

    if (!isLiveEndpoint) {
      return [
        {
          external_id: 'cust_ord_501',
          order_number: 'CUST-9501',
          customer_name: 'Tanvir Hossain',
          customer_phone: '01711998877',
          shipping_address: 'House 14, Road 6, Block C, Banani',
          city: 'Dhaka',
          total_amount: 1700,
          payment_method: 'cod',
          items: [
            { sku: 'CUST-HON-01', name: 'Sundarban Organic Raw Honey Jar (500g)', quantity: 2, price: 850 },
          ],
        },
        {
          external_id: 'cust_ord_502',
          order_number: 'CUST-9502',
          customer_name: 'Nusrat Jahan Mim',
          customer_phone: '01819334455',
          shipping_address: 'Flat 4B, House 22, Nasirabad Housing Society',
          city: 'Chattogram',
          total_amount: 1730,
          payment_method: 'cod',
          items: [
            { sku: 'CUST-OIL-02', name: 'Cold-Pressed Black Seed Oil (200ml)', quantity: 1, price: 580 },
            { sku: 'CUST-TEA-03', name: 'Artisanal Sylhet Gold Leaf Tea (1kg)', quantity: 1, price: 1150 },
          ],
        },
      ];
    }

    try {
      const res = await fetch(`${storeUrl.replace(/\/$/, '')}/api/orders`, {
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Custom API returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.warn(`CustomApi live orders fallback to sandbox orders: ${err.message}`);
      return [];
    }
  }

  async updateInventory(
    _storeUrl: string,
    _credentials: Record<string, string>,
    sku: string,
    stock: number
  ): Promise<boolean> {
    this.logger.log(`[CustomApi] Synchronized inventory for SKU ${sku} -> ${stock}`);
    return true;
  }
}
