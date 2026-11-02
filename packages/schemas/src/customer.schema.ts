import { z } from 'zod';
import { shippingAddressSchema } from './order.schema';

export const customerAddressSchema = shippingAddressSchema.extend({
  label: z.string().default('Home'),
  is_default: z.boolean().default(false),
});

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name is required').trim(),
  phone_number: z.string().min(11, 'Valid 11-digit phone number is required').trim(),
  email: z.string().email().nullable().optional(),
  addresses: z.array(customerAddressSchema).default([]),
  tags: z.array(z.string()).default([]),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
