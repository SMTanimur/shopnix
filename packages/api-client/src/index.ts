import { ShopnixApiClient, type ApiClientConfig } from './client';
import { AuthApi } from './auth.api';
import { ProductsApi } from './products.api';
import { OrdersApi } from './orders.api';
import { InventoryApi } from './inventory.api';
import { CustomersApi } from './customers.api';
import { CouriersApi } from './couriers.api';
import { AnalyticsApi } from './analytics.api';

export * from './client';
export * from './auth.api';
export * from './products.api';
export * from './orders.api';
export * from './inventory.api';
export * from './customers.api';
export * from './couriers.api';
export * from './analytics.api';

export function createApiClient(config: ApiClientConfig) {
  const client = new ShopnixApiClient(config);
  const axios = client.axiosInstance;

  return {
    client,
    axios,
    auth: new AuthApi(axios),
    products: new ProductsApi(axios),
    orders: new OrdersApi(axios),
    inventory: new InventoryApi(axios),
    customers: new CustomersApi(axios),
    couriers: new CouriersApi(axios),
    analytics: new AnalyticsApi(axios),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
