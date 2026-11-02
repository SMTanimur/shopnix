import type { ShippingAddress } from './order';

export interface CustomerAddress extends ShippingAddress {
  label: string;
  is_default: boolean;
}

export interface Customer {
  id: string;
  organization_id: string;
  name: string;
  phone_number: string;
  email: string | null;
  addresses: CustomerAddress[];
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  returned_orders: number;
  total_spent: number;
  return_rate_percentage: number;
  is_high_risk: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerFilterParams {
  search?: string;
  is_high_risk?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
