export type CourierProviderName =
  | 'steadfast'
  | 'pathao'
  | 'redx'
  | 'ecourier'
  | 'sandbox';

export interface CourierConfiguration {
  id: string;
  organization_id: string;
  provider: CourierProviderName;
  is_active: boolean;
  credentials: Record<string, string>;
  default_pickup_store_id?: string | null;
  default_delivery_type?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsignmentRequest {
  order_id: string;
  invoice_number: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city?: string;
  recipient_zone?: string;
  recipient_area?: string;
  cod_amount: number;
  item_weight?: number; // In kg or grams depending on provider
  item_description?: string;
  special_instruction?: string;
}

export interface ConsignmentResponse {
  success: boolean;
  consignment_id: string;
  tracking_code: string;
  courier_status: string;
  delivery_charge?: number;
  raw_response?: Record<string, unknown>;
}

export interface TrackingResponse {
  consignment_id: string;
  tracking_code: string;
  status: string;
  current_location?: string;
  timeline?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

export interface ICourierProvider {
  readonly providerName: CourierProviderName;
  createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse>;
  trackShipment(trackingCode: string): Promise<TrackingResponse>;
  cancelShipment(consignmentId: string): Promise<boolean>;
  getDeliveryCharge(weight: number, city: string): Promise<number>;
}
