export type AdminRole = 'super_admin' | 'support_admin' | 'billing_admin';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface SubscriptionPlanLimits {
  max_stores: number;
  max_orders_per_month: number;
  max_products: number;
  max_ai_tokens_per_month: number;
  max_team_members: number;
}

export interface SubscriptionPlanFeatures {
  whatsapp_enabled: boolean;
  messenger_enabled: boolean;
  automations_enabled: boolean;
  ai_copilot_enabled: boolean;
  ai_agents_enabled: boolean;
  courier_integrations_enabled: boolean;
}

export interface PlatformSubscriptionPlan {
  id: string;
  name: string;
  code: string;
  monthly_price_bdt: number;
  yearly_price_bdt: number;
  limits: SubscriptionPlanLimits;
  features: SubscriptionPlanFeatures;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationAdminView {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  owner_name: string;
  subscription_plan: string;
  subscription_status: string;
  is_suspended: boolean;
  suspension_reason?: string | null;
  total_orders: number;
  total_revenue: number;
  ai_token_usage_this_month: number;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  target_type: 'organization' | 'user' | 'subscription' | 'ai_config' | 'system';
  target_id: string;
  details?: Record<string, any>;
  ip_address?: string | null;
  created_at: string;
}

export interface SuperAdminDashboardMetrics {
  total_organizations: number;
  active_subscriptions: number;
  total_users: number;
  total_orders_platform: number;
  total_gmv_bdt: number;
  total_ai_tokens_consumed: number;
  total_workflows_executed: number;
  recent_activity: AdminAuditLog[];
}

export interface CreateSubscriptionPlanDto {
  name: string;
  code: string;
  monthly_price_bdt: number;
  yearly_price_bdt: number;
  limits: SubscriptionPlanLimits;
  features: SubscriptionPlanFeatures;
  is_active?: boolean;
}

export interface UpdateSubscriptionPlanDto {
  name?: string;
  monthly_price_bdt?: number;
  yearly_price_bdt?: number;
  limits?: Partial<SubscriptionPlanLimits>;
  features?: Partial<SubscriptionPlanFeatures>;
  is_active?: boolean;
}

export interface UpdateOrganizationStatusDto {
  is_suspended: boolean;
  suspension_reason?: string;
}

export interface UpdateOrganizationPlanDto {
  plan_id: string;
  custom_limits?: Partial<SubscriptionPlanLimits>;
}
