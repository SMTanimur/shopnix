import { z } from 'zod';

export const connectStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  platform: z.enum(['shopify', 'woocommerce', 'custom', 'manual']),
  store_url: z.string().url('Must be a valid URL'),
  logo_url: z.string().url().optional().or(z.literal('')),
  api_credentials: z.record(z.string()),
  auto_sync_enabled: z.boolean().default(true),
  sync_interval_minutes: z.number().min(5).max(1440).default(30),
});

export const updateStoreSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  api_credentials: z.record(z.string()).optional(),
  auto_sync_enabled: z.boolean().optional(),
  sync_interval_minutes: z.number().min(5).max(1440).optional(),
});

export const triggerStoreSyncSchema = z.object({
  sync_type: z.enum(['products', 'orders', 'inventory', 'full']),
});

export type ConnectStoreInput = z.infer<typeof connectStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type TriggerStoreSyncInput = z.infer<typeof triggerStoreSyncSchema>;
