import type { AxiosInstance } from 'axios';
import type { DashboardMetrics, RevenueDataPoint, TopProductMetric, ApiResponse } from '@shopnix/types';

export class AnalyticsApi {
  constructor(private client: AxiosInstance) {}

  async getDashboardMetrics(dateRange?: string): Promise<ApiResponse<DashboardMetrics>> {
    const { data } = await this.client.get<ApiResponse<DashboardMetrics>>('/analytics/dashboard', {
      params: { range: dateRange },
    });
    return data;
  }

  async getRevenueTrends(days = 30): Promise<ApiResponse<RevenueDataPoint[]>> {
    const { data } = await this.client.get<ApiResponse<RevenueDataPoint[]>>('/analytics/revenue-trends', {
      params: { days },
    });
    return data;
  }

  async getTopProducts(limit = 5): Promise<ApiResponse<TopProductMetric[]>> {
    const { data } = await this.client.get<ApiResponse<TopProductMetric[]>>('/analytics/top-products', {
      params: { limit },
    });
    return data;
  }
}
