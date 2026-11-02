import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const subscriptionPlanLimitsSchema = z.object({
  max_stores: z.number().int().min(1),
  max_orders_per_month: z.number().int().min(1),
  max_products: z.number().int().min(1),
  max_ai_tokens_per_month: z.number().int().min(0),
  max_team_members: z.number().int().min(1),
});

export const subscriptionPlanFeaturesSchema = z.object({
  whatsapp_enabled: z.boolean(),
  messenger_enabled: z.boolean(),
  automations_enabled: z.boolean(),
  ai_copilot_enabled: z.boolean(),
  ai_agents_enabled: z.boolean(),
  courier_integrations_enabled: z.boolean(),
});

export const createSubscriptionPlanSchema = z.object({
  name: z.string().min(2).max(50),
  code: z.string().min(2).max(30),
  monthly_price_bdt: z.number().min(0),
  yearly_price_bdt: z.number().min(0),
  limits: subscriptionPlanLimitsSchema,
  features: subscriptionPlanFeaturesSchema,
  is_active: z.boolean().default(true),
});

export const updateSubscriptionPlanSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  monthly_price_bdt: z.number().min(0).optional(),
  yearly_price_bdt: z.number().min(0).optional(),
  limits: subscriptionPlanLimitsSchema.partial().optional(),
  features: subscriptionPlanFeaturesSchema.partial().optional(),
  is_active: z.boolean().optional(),
});

export const updateOrganizationStatusSchema = z.object({
  is_suspended: z.boolean(),
  suspension_reason: z.string().optional(),
});

export const updateOrganizationPlanSchema = z.object({
  plan_id: z.string().min(1),
  custom_limits: subscriptionPlanLimitsSchema.partial().optional(),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CreateSubscriptionPlanInput = z.infer<typeof createSubscriptionPlanSchema>;
export type UpdateSubscriptionPlanInput = z.infer<typeof updateSubscriptionPlanSchema>;
export type UpdateOrganizationStatusInput = z.infer<typeof updateOrganizationStatusSchema>;
export type UpdateOrganizationPlanInput = z.infer<typeof updateOrganizationPlanSchema>;
