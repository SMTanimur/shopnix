import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(2000),
  type: z.enum(['text', 'image', 'template', 'interactive', 'order_card']).default('text'),
  media_url: z.string().url().optional(),
});

export const updateConversationSchema = z.object({
  status: z.enum(['open', 'pending', 'resolved', 'bot_handling']).optional(),
  assigned_user_id: z.string().nullable().optional(),
  ai_mode: z.enum(['copilot', 'approval', 'auto', 'disabled']).optional(),
  tags: z.array(z.string()).optional(),
});

export const quickOrderFromChatSchema = z.object({
  customer_name: z.string().min(2, 'Customer name is required'),
  customer_phone: z.string().min(10, 'Valid phone number required'),
  delivery_address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required'),
  zone: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        variant_id: z.string().optional(),
        quantity: z.number().int().min(1),
        unit_price: z.number().min(0),
      })
    )
    .min(1, 'At least one item is required'),
  shipping_charge: z.number().min(0).default(60),
  notes: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type QuickOrderFromChatInput = z.infer<typeof quickOrderFromChatSchema>;
