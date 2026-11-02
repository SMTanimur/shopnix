export type StorePlatform = 'shopify' | 'woocommerce' | 'custom' | 'manual';

export type StoreConnectionStatus = 'connected' | 'disconnected' | 'error' | 'syncing';

export interface StoreIntegration {
  id: string;
  organization_id: string;
  name: string;
  platform: StorePlatform;
  store_url: string;
  logo_url?: string | null;
  connection_status: StoreConnectionStatus;
  auto_sync_enabled: boolean;
  sync_interval_minutes: number;
  last_synced_at?: string | null;
  last_sync_status?: 'success' | 'failed' | 'partial' | null;
  last_sync_error?: string | null;
  product_count?: number;
  order_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreSyncLog {
  id: string;
  organization_id: string;
  store_id: string;
  sync_type: 'products' | 'orders' | 'inventory' | 'full';
  status: 'running' | 'success' | 'failed' | 'partial';
  items_fetched: number;
  items_created: number;
  items_updated: number;
  items_failed: number;
  errors?: Array<{ item_id?: string; message: string }>;
  duration_ms: number;
  started_at: string;
  completed_at?: string | null;
}

export interface ConnectStoreDto {
  name: string;
  platform: StorePlatform;
  store_url: string;
  logo_url?: string;
  api_credentials: Record<string, string>;
  auto_sync_enabled?: boolean;
  sync_interval_minutes?: number;
}

export interface UpdateStoreDto {
  name?: string;
  logo_url?: string;
  api_credentials?: Record<string, string>;
  auto_sync_enabled?: boolean;
  sync_interval_minutes?: number;
}

export interface TriggerStoreSyncDto {
  sync_type: 'products' | 'orders' | 'inventory' | 'full';
}
