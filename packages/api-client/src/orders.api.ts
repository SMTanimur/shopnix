import type { AxiosInstance } from 'axios';
import type { Order, OrderFilterParams, ApiResponse } from '@shopnix/types';
import type { CreateOrderInput, UpdateOrderStatusInput } from '@shopnix/schemas';

export class OrdersApi {
  constructor(private client: AxiosInstance) {}

  async list(params?: OrderFilterParams): Promise<ApiResponse<Order[]>> {
    const { data } = await this.client.get<ApiResponse<Order[]>>('/orders', { params });
    return data;
  }

  async getById(id: string): Promise<ApiResponse<Order>> {
    const { data } = await this.client.get<ApiResponse<Order>>(`/orders/${id}`);
    return data;
  }

  async create(input: CreateOrderInput): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post<ApiResponse<Order>>('/orders', input);
    return data;
  }

  async updateStatus(id: string, input: UpdateOrderStatusInput): Promise<ApiResponse<Order>> {
    const { data } = await this.client.patch<ApiResponse<Order>>(`/orders/${id}/status`, input);
    return data;
  }

  async addNote(id: string, note: string): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post<ApiResponse<Order>>(`/orders/${id}/notes`, { note });
    return data;
  }
}
