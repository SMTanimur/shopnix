import type { AxiosInstance } from 'axios';
import type { Customer, CustomerFilterParams, ApiResponse } from '@shopnix/types';
import type { CreateCustomerInput } from '@shopnix/schemas';

export class CustomersApi {
  constructor(private client: AxiosInstance) {}

  async list(params?: CustomerFilterParams): Promise<ApiResponse<Customer[]>> {
    const { data } = await this.client.get<ApiResponse<Customer[]>>('/customers', { params });
    return data;
  }

  async getById(id: string): Promise<ApiResponse<Customer>> {
    const { data } = await this.client.get<ApiResponse<Customer>>(`/customers/${id}`);
    return data;
  }

  async create(input: CreateCustomerInput): Promise<ApiResponse<Customer>> {
    const { data } = await this.client.post<ApiResponse<Customer>>('/customers', input);
    return data;
  }
}
