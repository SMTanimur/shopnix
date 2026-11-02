export interface ExternalProduct {
  external_id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: string[];
}

export interface ExternalOrder {
  external_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  total_amount: number;
  payment_method: string;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface IStoreConnector {
  fetchProducts(storeUrl: string, credentials: Record<string, string>): Promise<ExternalProduct[]>;
  fetchOrders(storeUrl: string, credentials: Record<string, string>): Promise<ExternalOrder[]>;
  updateInventory(storeUrl: string, credentials: Record<string, string>, sku: string, stock: number): Promise<boolean>;
}
