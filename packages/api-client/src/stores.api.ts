import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  StoreIntegration,
  StoreSyncLog,
  ConnectStoreDto,
  UpdateStoreDto,
  TriggerStoreSyncDto,
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
}
