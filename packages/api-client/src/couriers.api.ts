import type { AxiosInstance } from 'axios';
import type { CourierConfiguration, ConsignmentResponse, TrackingResponse, ApiResponse } from '@shopnix/types';
import type { ConfigureCourierInput, DispatchCourierInput } from '@shopnix/schemas';

export class CouriersApi {
  constructor(private client: AxiosInstance) {}

  async getConfigurations(): Promise<ApiResponse<CourierConfiguration[]>> {
    const { data } = await this.client.get<ApiResponse<CourierConfiguration[]>>('/couriers/configs');
    return data;
  }

  async configure(input: ConfigureCourierInput): Promise<ApiResponse<CourierConfiguration>> {
    const { data } = await this.client.post<ApiResponse<CourierConfiguration>>('/couriers/configure', input);
    return data;
  }

  async dispatch(input: DispatchCourierInput): Promise<ApiResponse<ConsignmentResponse>> {
    const { data } = await this.client.post<ApiResponse<ConsignmentResponse>>('/couriers/dispatch', input);
    return data;
  }

  async track(consignmentId: string): Promise<ApiResponse<TrackingResponse>> {
    const { data } = await this.client.get<ApiResponse<TrackingResponse>>(`/couriers/track/${consignmentId}`);
    return data;
  }
}
