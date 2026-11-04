import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  StoreIntegration,
  StoreSyncLog,
  ConnectStoreDto,
  UpdateStoreDto,
  TriggerStoreSyncDto,
  Product,
  Order,
  OrderStatus,
} from '@shopnix/types';

export class StoresApi {
  constructor(private readonly axios: AxiosInstance) {}

  async listStores(): Promise<ApiResponse<StoreIntegration[]>> {
    const { data } = await this.axios.get<ApiResponse<StoreIntegration[]>>('/stores');
    return data;
  }

  async getStore(id: string): Promise<ApiResponse<StoreIntegration>> {
    const { data } = await this.axios.get<ApiResponse<StoreIntegration>>(`/stores/${id}`);
    return data;
  }

  async connectStore(dto: ConnectStoreDto): Promise<ApiResponse<StoreIntegration>> {
    const { data } = await this.axios.post<ApiResponse<StoreIntegration>>('/stores', dto);
    return data;
  }

  async updateStore(id: string, dto: UpdateStoreDto): Promise<ApiResponse<StoreIntegration>> {
    const { data } = await this.axios.patch<ApiResponse<StoreIntegration>>(`/stores/${id}`, dto);
    return data;
  }

  async disconnectStore(id: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await this.axios.delete<ApiResponse<{ message: string }>>(`/stores/${id}`);
    return data;
  }

  async triggerSync(id: string, dto: TriggerStoreSyncDto): Promise<ApiResponse<{ message: string; sync_log_id: string }>> {
    const { data } = await this.axios.post<ApiResponse<{ message: string; sync_log_id: string }>>(
      `/stores/${id}/sync`,
      dto
    );
    return data;
  }

  async getSyncLogs(storeId: string): Promise<ApiResponse<StoreSyncLog[]>> {
    const { data } = await this.axios.get<ApiResponse<StoreSyncLog[]>>(`/stores/${storeId}/logs`);
    return data;
  }

  async getStoreProducts(storeId: string): Promise<ApiResponse<Product[]>> {
    const { data } = await this.axios.get<ApiResponse<Product[]>>(`/stores/${storeId}/products`);
    return data;
  }

  async updateStoreProduct(
    storeId: string,
    productId: string,
    payload: { stock_quantity?: number; regular_price?: number }
  ): Promise<ApiResponse<Product>> {
    const { data } = await this.axios.patch<ApiResponse<Product>>(
      `/stores/${storeId}/products/${productId}`,
      payload
    );
    return data;
  }

  async getStoreOrders(storeId: string): Promise<ApiResponse<Order[]>> {
    const { data } = await this.axios.get<ApiResponse<Order[]>>(`/stores/${storeId}/orders`);
    return data;
  }

  async updateStoreOrderStatus(
    storeId: string,
    orderId: string,
    payload: { status: OrderStatus; note?: string }
  ): Promise<ApiResponse<Order>> {
    const { data } = await this.axios.patch<ApiResponse<Order>>(
      `/stores/${storeId}/orders/${orderId}/status`,
      payload
    );
    return data;
  }
}
