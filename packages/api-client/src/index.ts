import { ShopnixApiClient, type ApiClientConfig } from './client';
import { AuthApi } from './auth.api';
import { ProductsApi } from './products.api';
import { OrdersApi } from './orders.api';
import { InventoryApi } from './inventory.api';
import { CustomersApi } from './customers.api';
import { CouriersApi } from './couriers.api';
import { AnalyticsApi } from './analytics.api';
import { StoresApi } from './stores.api';
import { InboxApi } from './inbox.api';
import { AiApi } from './ai.api';
import { AutomationApi } from './automation.api';
import { AdminApi } from './admin.api';

export * from './client';
export * from './auth.api';
export * from './products.api';
export * from './orders.api';
export * from './inventory.api';
export * from './customers.api';
export * from './couriers.api';
export * from './analytics.api';
export * from './stores.api';
export * from './inbox.api';
export * from './ai.api';
export * from './automation.api';
export * from './admin.api';

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
    stores: new StoresApi(axios),
    inbox: new InboxApi(axios),
    ai: new AiApi(axios),
    automation: new AutomationApi(axios),
    admin: new AdminApi(axios),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
