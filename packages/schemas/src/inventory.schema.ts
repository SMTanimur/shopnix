import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  variant_id: z.string().nullable().optional(),
  quantity_change: z.number().int().refine((val: number) => val !== 0, {
    message: 'Quantity change cannot be zero',
  }),
  type: z.enum(['sale', 'restock', 'adjustment', 'return', 'initial']),
  note: z.string().max(250).optional(),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
