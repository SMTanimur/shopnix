import type { AxiosInstance } from 'axios';
import type { Product, ProductFilterParams, ApiResponse } from '@shopnix/types';
import type { CreateProductInput, UpdateProductInput } from '@shopnix/schemas';

export class ProductsApi {
  constructor(private client: AxiosInstance) {}

  async list(params?: ProductFilterParams): Promise<ApiResponse<Product[]>> {
    const { data } = await this.client.get<ApiResponse<Product[]>>('/products', { params });
    return data;
  }

  async getById(id: string): Promise<ApiResponse<Product>> {
    const { data } = await this.client.get<ApiResponse<Product>>(`/products/${id}`);
    return data;
  }

  async create(input: CreateProductInput): Promise<ApiResponse<Product>> {
    const { data } = await this.client.post<ApiResponse<Product>>('/products', input);
    return data;
  }

  async update(id: string, input: UpdateProductInput): Promise<ApiResponse<Product>> {
    const { data } = await this.client.patch<ApiResponse<Product>>(`/products/${id}`, input);
    return data;
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const { data } = await this.client.delete<ApiResponse<null>>(`/products/${id}`);
    return data;
  }

  async duplicate(id: string): Promise<ApiResponse<Product>> {
    const { data } = await this.client.post<ApiResponse<Product>>(`/products/${id}/duplicate`);
    return data;
  }
}
