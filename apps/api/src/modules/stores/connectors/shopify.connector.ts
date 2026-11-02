import { Injectable, Logger } from '@nestjs/common';
import type { IStoreConnector, ExternalProduct, ExternalOrder } from './base-store.connector';

@Injectable()
export class ShopifyConnector implements IStoreConnector {
  private readonly logger = new Logger(ShopifyConnector.name);

  async fetchProducts(storeUrl: string, credentials: Record<string, string>): Promise<ExternalProduct[]> {
    const accessToken = credentials.access_token || credentials.password;
    if (!accessToken) {
      // Mock/Sandbox response if no active live credentials provided
      return [
        {
          external_id: 'sh_prod_101',
          name: 'Shopify Premium Cotton Panjabi',
          sku: 'SH-PAN-01',
          description: 'Export quality hand-stitched 100% cotton panjabi.',
          price: 2450,
          stock_quantity: 45,
          images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600'],
        },
        {
          external_id: 'sh_prod_102',
          name: 'Shopify Minimalist Leather Wallet',
          sku: 'SH-WAL-02',
          description: 'Full-grain vintage genuine cowhide leather wallet.',
          price: 1200,
          stock_quantity: 28,
          images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
        },
      ];
    }

    try {
      const formattedUrl = storeUrl.replace(/\/$/, '');
      const res = await fetch(`${formattedUrl}/admin/api/2024-01/products.json?limit=50`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Shopify API error: ${res.statusText}`);
      }

      const data = await res.json();
      return (data.products || []).map((p: any) => ({
        external_id: String(p.id),
        name: p.title,
        sku: p.variants?.[0]?.sku || `SH-${p.id}`,
        description: p.body_html?.replace(/<[^>]*>?/gm, '') || '',
        price: parseFloat(p.variants?.[0]?.price || '0'),
        stock_quantity: p.variants?.[0]?.inventory_quantity || 0,
        images: (p.images || []).map((img: any) => img.src),
      }));
    } catch (err: any) {
      this.logger.error(`Shopify fetchProducts failed: ${err.message}`);
      throw err;
    }
  }

  async fetchOrders(storeUrl: string, credentials: Record<string, string>): Promise<ExternalOrder[]> {
    const accessToken = credentials.access_token || credentials.password;
    if (!accessToken) {
      return [
        {
          external_id: 'sh_ord_9001',
          order_number: 'SH-1001',
          customer_name: 'Rafiqul Islam',
          customer_phone: '01711223344',
          shipping_address: 'House 14, Road 5, Dhanmondi',
          city: 'Dhaka',
          total_amount: 3650,
          payment_method: 'cod',
          items: [
            { sku: 'SH-PAN-01', name: 'Shopify Premium Cotton Panjabi', quantity: 1, price: 2450 },
            { sku: 'SH-WAL-02', name: 'Shopify Minimalist Leather Wallet', quantity: 1, price: 1200 },
          ],
        },
      ];
    }

    const formattedUrl = storeUrl.replace(/\/$/, '');
    const res = await fetch(`${formattedUrl}/admin/api/2024-01/orders.json?status=any&limit=50`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Shopify orders API error: ${res.statusText}`);
    const data = await res.json();

    return (data.orders || []).map((o: any) => ({
      external_id: String(o.id),
      order_number: o.name || `#${o.order_number}`,
      customer_name: `${o.customer?.first_name || ''} ${o.customer?.last_name || ''}`.trim() || 'Guest Customer',
      customer_phone: o.shipping_address?.phone || o.customer?.phone || '01700000000',
      shipping_address: `${o.shipping_address?.address1 || ''}, ${o.shipping_address?.city || ''}`,
      city: o.shipping_address?.city || 'Dhaka',
      total_amount: parseFloat(o.total_price || '0'),
      payment_method: o.financial_status === 'paid' ? 'online' : 'cod',
      items: (o.line_items || []).map((li: any) => ({
        sku: li.sku || String(li.id),
        name: li.title,
        quantity: li.quantity,
        price: parseFloat(li.price || '0'),
      })),
    }));
  }

  async updateInventory(
    storeUrl: string,
    credentials: Record<string, string>,
    sku: string,
    stock: number
  ): Promise<boolean> {
    this.logger.log(`[Shopify Mock] Synchronized inventory for SKU ${sku} -> ${stock}`);
    return true;
  }
}
