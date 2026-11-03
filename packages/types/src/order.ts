export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'unpaid' | 'paid' | 'partial' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'aamarpay' | 'bank_transfer' | 'card';

export interface OrderItem {
  product_id: string;
  variant_id: string | null;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
}

export interface ShippingAddress {
  address_line: string;
  city: string;
  zone: string;
  area: string;
  postal_code?: string | null;
}

export interface OrderTimelineEvent {
  status: string;
  note: string;
  author_id: string | null;
  created_at: string;
}

export interface OrderNote {
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

export interface Order {
  id: string;
  organization_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_charge: number;
  discount_amount: number;
  total_amount: number;
  cod_amount: number;
  courier_provider: string | null;
  consignment_id: string | null;
  tracking_code: string | null;
  courier_status: string | null;
  timeline: OrderTimelineEvent[];
  notes: OrderNote[];
  created_at: string;
  updated_at: string;
}

export interface OrderFilterParams {
  search?: string;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  courier_provider?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
