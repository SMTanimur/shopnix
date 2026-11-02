import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  AdminAuthTokens,
  AdminLoginDto,
  AdminUser,
  SuperAdminDashboardMetrics,
  OrganizationAdminView,
  PlatformSubscriptionPlan,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  UpdateOrganizationStatusDto,
  UpdateOrganizationPlanDto,
  AdminAuditLog,
} from '@shopnix/types';

export class AdminApi {
  constructor(private readonly axios: AxiosInstance) {}

  async login(dto: AdminLoginDto): Promise<ApiResponse<{ admin: AdminUser; tokens: AdminAuthTokens }>> {
    const { data } = await this.axios.post<ApiResponse<{ admin: AdminUser; tokens: AdminAuthTokens }>>(
      '/admin/auth/login',
      dto
    );
    return data;
  }

  async getMe(): Promise<ApiResponse<AdminUser>> {
    const { data } = await this.axios.get<ApiResponse<AdminUser>>('/admin/auth/me');
    return data;
  }

  async getMetrics(): Promise<ApiResponse<SuperAdminDashboardMetrics>> {
    const { data } = await this.axios.get<ApiResponse<SuperAdminDashboardMetrics>>('/admin/metrics');
    return data;
  }

  async listOrganizations(): Promise<ApiResponse<OrganizationAdminView[]>> {
    const { data } = await this.axios.get<ApiResponse<OrganizationAdminView[]>>(
      '/admin/organizations'
    );
    return data;
  }

  async updateOrganizationStatus(
    id: string,
    dto: UpdateOrganizationStatusDto
  ): Promise<ApiResponse<OrganizationAdminView>> {
    const { data } = await this.axios.patch<ApiResponse<OrganizationAdminView>>(
      `/admin/organizations/${id}/status`,
      dto
    );
    return data;
  }

  async updateOrganizationPlan(
    id: string,
    dto: UpdateOrganizationPlanDto
  ): Promise<ApiResponse<OrganizationAdminView>> {
    const { data } = await this.axios.patch<ApiResponse<OrganizationAdminView>>(
      `/admin/organizations/${id}/plan`,
      dto
    );
    return data;
  }

  async listPlans(): Promise<ApiResponse<PlatformSubscriptionPlan[]>> {
    const { data } = await this.axios.get<ApiResponse<PlatformSubscriptionPlan[]>>('/admin/subscriptions');
    return data;
  }

  async createPlan(dto: CreateSubscriptionPlanDto): Promise<ApiResponse<PlatformSubscriptionPlan>> {
    const { data } = await this.axios.post<ApiResponse<PlatformSubscriptionPlan>>(
      '/admin/subscriptions',
      dto
    );
    return data;
  }

  async updatePlan(
    id: string,
    dto: UpdateSubscriptionPlanDto
  ): Promise<ApiResponse<PlatformSubscriptionPlan>> {
    const { data } = await this.axios.patch<ApiResponse<PlatformSubscriptionPlan>>(
      `/admin/subscriptions/${id}`,
      dto
    );
    return data;
  }

  async listAuditLogs(): Promise<ApiResponse<AdminAuditLog[]>> {
    const { data } = await this.axios.get<ApiResponse<AdminAuditLog[]>>('/admin/audit-logs');
    return data;
  }

  async getGlobalAIStatus(): Promise<ApiResponse<{
    openrouter_configured: boolean;
    gemini_configured: boolean;
    openai_configured: boolean;
    total_tokens_consumed: number;
    estimated_cost_bdt: number;
  }>> {
    const { data } = await this.axios.get('/admin/ai/status');
    return data;
  }

  async saveGlobalAIKey(provider: string, api_key: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await this.axios.post('/admin/ai/keys', { provider, api_key });
    return data;
  }
}
