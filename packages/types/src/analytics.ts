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
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProductMetric {
  id: string;
  name: string;
  sku: string;
  image_url: string | null;
  units_sold: number;
  gross_revenue: number;
}
