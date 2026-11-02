export type SubscriptionPlan = 'starter' | 'growth' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'cancelled';

export interface StoreAddress {
  address_line: string;
  city: string;
  zone: string;
  area: string;
  postal_code?: string;
}

export interface OrganizationSettings {
  currency: string;
  currency_symbol: string;
  timezone: string;
  default_courier?: string | null;
  low_stock_alert_threshold: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  store_name: string;
  store_phone: string;
  store_email: string;
  store_address: StoreAddress;
  logo_url: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  settings: OrganizationSettings;
  created_at: string;
  updated_at: string;
}
