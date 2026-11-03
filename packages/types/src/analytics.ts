import type { CourierProviderName } from './courier';

export interface CourierPerformanceMetric {
  provider: CourierProviderName;
  name: string;
  total_dispatched: number;
  delivered: number;
  returned: number;
  in_transit: number;
  success_rate: number;
  avg_transit_hours: number;
  cod_collected: number;
}

export interface DivisionRevenueMetric {
  division: string;
  orders: number;
  revenue: number;
  rto_rate: number;
}

export interface FunnelStageMetric {
  stage: string;
  count: number;
  conversion_rate: number;
  value_bdt: number;
}

export interface DashboardMetrics {
  total_revenue: number;
  revenue_growth_percentage: number;
  total_orders: number;
  orders_growth_percentage: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  returned_orders: number;
  low_stock_products_count: number;
  total_customers: number;
  net_collected_revenue?: number;
  pending_cod_receivable?: number;
  rto_loss_amount?: number;
  delivery_success_rate?: number;
  courier_performance?: CourierPerformanceMetric[];
  division_breakdown?: DivisionRevenueMetric[];
  funnel_stages?: FunnelStageMetric[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  delivered_revenue?: number;
  rto_loss?: number;
}

export interface TopProductMetric {
  id: string;
  name: string;
  sku: string;
  image_url: string | null;
  units_sold: number;
  gross_revenue: number;
}
