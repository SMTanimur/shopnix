import { z } from 'zod';

export const courierProviderEnum = z.enum([
  'steadfast',
  'pathao',
  'redx',
  'paperfly',
  'ecourier',
  'carrybee',
  'sandbox',
]);

export const configureCourierSchema = z.object({
  provider: courierProviderEnum,
  is_active: z.boolean().default(true),
  credentials: z.record(z.string(), z.string()),
  default_pickup_store_id: z.string().nullable().optional(),
  default_delivery_type: z.string().nullable().optional(),
});

export const dispatchCourierSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  provider: courierProviderEnum,
  item_weight: z.number().positive().default(0.5),
  special_instruction: z.string().optional(),
});

export type ConfigureCourierInput = z.infer<typeof configureCourierSchema>;
export type DispatchCourierInput = z.infer<typeof dispatchCourierSchema>;
