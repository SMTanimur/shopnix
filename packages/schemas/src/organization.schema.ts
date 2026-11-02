import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),
  store_name: z.string().min(2).optional(),
  store_phone: z.string().min(11).optional(),
  store_email: z.string().email().optional(),
  logo_url: z.string().url().nullable().optional(),
  settings: z
    .object({
      currency: z.string().default('BDT'),
      currency_symbol: z.string().default('৳'),
      timezone: z.string().default('Asia/Dhaka'),
      default_courier: z.string().nullable().optional(),
      low_stock_alert_threshold: z.number().int().min(1).default(5),
    })
    .optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
