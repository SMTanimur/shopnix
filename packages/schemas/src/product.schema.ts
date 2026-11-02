import { z } from 'zod';

export const productImageSchema = z.object({
  url: z.string().url('Must be a valid image URL'),
  alt_text: z.string().default(''),
  sort_order: z.number().int().default(0),
  is_primary: z.boolean().default(false),
});

export const variantOptionSchema = z.object({
  name: z.string().min(1, 'Option name is required'), // e.g. 'Size'
  values: z.array(z.string().min(1)).min(1, 'At least one value is required'),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required').trim(),
  description: z.string().default(''),
  short_description: z.string().default(''),
  sku: z.string().min(2, 'SKU is required').toUpperCase().trim(),
  barcode: z.string().nullable().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  regular_price: z.number().min(0, 'Regular price must be 0 or greater'),
  sale_price: z.number().min(0).nullable().optional(),
  cost_price: z.number().min(0).nullable().optional(),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative').default(0),
  low_stock_threshold: z.number().int().min(0).default(5),
  track_inventory: z.boolean().default(true),
  images: z.array(productImageSchema).default([]),
  category_ids: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  has_variants: z.boolean().default(false),
  variant_options: z.array(variantOptionSchema).default([]),
  weight: z.number().nullable().optional(),
  weight_unit: z.enum(['kg', 'g']).default('kg'),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  seo_keywords: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const productVariantSchema = z.object({
  sku: z.string().min(2, 'Variant SKU is required').toUpperCase().trim(),
  barcode: z.string().nullable().optional(),
  option_values: z.record(z.string(), z.string()),
  regular_price: z.number().min(0),
  sale_price: z.number().min(0).nullable().optional(),
  cost_price: z.number().min(0).nullable().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
