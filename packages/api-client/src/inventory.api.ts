import type { AxiosInstance } from 'axios';
import type { InventoryMovement, ApiResponse } from '@shopnix/types';
import type { StockAdjustmentInput } from '@shopnix/schemas';

export class InventoryApi {
  constructor(private client: AxiosInstance) {}

  async listMovements(productId?: string): Promise<ApiResponse<InventoryMovement[]>> {
    const { data } = await this.client.get<ApiResponse<InventoryMovement[]>>('/inventory/movements', {
      params: { product_id: productId },
    });
    return data;
  }

  async adjustStock(input: StockAdjustmentInput): Promise<ApiResponse<InventoryMovement>> {
    const { data } = await this.client.post<ApiResponse<InventoryMovement>>('/inventory/adjust', input);
    return data;
  }
}
