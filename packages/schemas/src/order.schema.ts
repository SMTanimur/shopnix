import { z } from 'zod';

export const orderItemSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  variant_id: z.string().nullable().optional(),
  name: z.string().min(1, 'Item name is required'),
  sku: z.string().min(1, 'Item SKU is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Unit price cannot be negative'),
  total_price: z.number().min(0),
  image_url: z.string().nullable().optional(),
});

export const shippingAddressSchema = z.object({
  address_line: z.string().min(3, 'Address is required').trim(),
  city: z.string().min(2, 'City is required').trim(),
  zone: z.string().default(''),
  area: z.string().default(''),
  postal_code: z.string().nullable().optional(),
});

export const createOrderSchema = z.object({
  customer_name: z.string().min(2, 'Customer name is required').trim(),
  customer_phone: z.string().min(11, 'Valid phone number required').trim(),
  customer_email: z.string().email().nullable().optional(),
  shipping_address: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  shipping_charge: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
  payment_method: z.enum(['cod', 'bkash', 'nagad', 'bank_transfer', 'card']).default('cod'),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ]),
  note: z.string().optional(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
