import { Injectable, Logger } from '@nestjs/common';
import type { IStoreConnector, ExternalProduct, ExternalOrder } from './base-store.connector';

@Injectable()
export class WooCommerceConnector implements IStoreConnector {
  private readonly logger = new Logger(WooCommerceConnector.name);

  async fetchProducts(storeUrl: string, credentials: Record<string, string>): Promise<ExternalProduct[]> {
    const key = credentials.consumer_key;
    const secret = credentials.consumer_secret;

    if (!key || !secret) {
      return [
        {
          external_id: 'woo_prod_201',
          name: 'WooCommerce Silk Floral Saree',
          sku: 'WOO-SAR-01',
          description: 'Pure georgette printed festive saree with blouse piece.',
          price: 3200,
          stock_quantity: 15,
          images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
        },
        {
          external_id: 'woo_prod_202',
          name: 'WooCommerce Wireless Bluetooth Earbuds',
          sku: 'WOO-EAR-02',
          description: 'ANC active noise cancellation earbuds with 36hr battery.',
          price: 1850,
          stock_quantity: 60,
          images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
        },
      ];
    }

    try {
      const basicAuth = Buffer.from(`${key}:${secret}`).toString('base64');
      const formattedUrl = storeUrl.replace(/\/$/, '');
      const res = await fetch(`${formattedUrl}/wp-json/wc/v3/products?per_page=50`, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`WooCommerce API error: ${res.statusText}`);
      const data = await res.json();

      return data.map((p: any) => ({
        external_id: String(p.id),
        name: p.name,
        sku: p.sku || `WOO-${p.id}`,
        description: p.short_description?.replace(/<[^>]*>?/gm, '') || p.description?.replace(/<[^>]*>?/gm, '') || '',
        price: parseFloat(p.price || '0'),
        stock_quantity: p.stock_quantity ?? 10,
        images: (p.images || []).map((img: any) => img.src),
      }));
    } catch (err: any) {
      this.logger.error(`WooCommerce fetchProducts failed: ${err.message}`);
      throw err;
    }
  }

  async fetchOrders(storeUrl: string, credentials: Record<string, string>): Promise<ExternalOrder[]> {
    const key = credentials.consumer_key;
    const secret = credentials.consumer_secret;

    if (!key || !secret) {
      return [
        {
          external_id: 'woo_ord_801',
          order_number: 'WC-801',
          customer_name: 'Farhana Ahmed',
          customer_phone: '01819876543',
          shipping_address: 'Flat 4B, Sector 3, Uttara',
          city: 'Dhaka',
          total_amount: 3200,
          payment_method: 'cod',
          items: [
            { sku: 'WOO-SAR-01', name: 'WooCommerce Silk Floral Saree', quantity: 1, price: 3200 },
          ],
        },
      ];
    }

    const basicAuth = Buffer.from(`${key}:${secret}`).toString('base64');
    const formattedUrl = storeUrl.replace(/\/$/, '');
    const res = await fetch(`${formattedUrl}/wp-json/wc/v3/orders?per_page=50`, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`WooCommerce orders API error: ${res.statusText}`);
    const data = await res.json();

    return data.map((o: any) => ({
      external_id: String(o.id),
      order_number: `#${o.id}`,
      customer_name: `${o.billing?.first_name || ''} ${o.billing?.last_name || ''}`.trim() || 'Guest Customer',
      customer_phone: o.billing?.phone || '01800000000',
      shipping_address: `${o.shipping?.address_1 || o.billing?.address_1 || ''}, ${o.shipping?.city || ''}`,
      city: o.shipping?.city || o.billing?.city || 'Dhaka',
      total_amount: parseFloat(o.total || '0'),
      payment_method: o.payment_method === 'cod' ? 'cod' : 'online',
      items: (o.line_items || []).map((li: any) => ({
        sku: li.sku || String(li.product_id),
        name: li.name,
        quantity: li.quantity,
        price: parseFloat(li.total || '0'),
      })),
    }));
  }

  async updateInventory(
    storeUrl: string,
    credentials: Record<string, string>,
    sku: string,
    stock: number
  ): Promise<boolean> {
    this.logger.log(`[WooCommerce Mock] Synchronized inventory for SKU ${sku} -> ${stock}`);
    return true;
  }
}
