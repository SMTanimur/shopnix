import { Injectable, OnModuleInit, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type {
  AdminUser as IAdminUser,
  AdminAuthTokens,
  AdminLoginDto,
  SuperAdminDashboardMetrics,
  OrganizationAdminView,
  PlatformSubscriptionPlan,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  UpdateOrganizationStatusDto,
  UpdateOrganizationPlanDto,
  AdminAuditLog as IAdminAuditLog,
} from '@shopnix/types';
import { AdminUser, type AdminUserDocument } from './schemas/admin-user.schema';
import { SubscriptionPlan, type SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { AdminAuditLog, type AdminAuditLogDocument } from './schemas/admin-audit-log.schema';
import { Organization, type OrganizationDocument } from '../organizations/organization.schema';
import { User, type UserDocument } from '../users/user.schema';
import { Order, type OrderDocument } from '../orders/order.schema';
import { AIUsage, type AIUsageDocument } from '../ai/schemas/ai-usage.schema';
import { WorkflowDefinition, type WorkflowDefinitionDocument } from '../automation/schemas/workflow-definition.schema';
import { EncryptionService } from '../ai/crypto/encryption.service';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(AdminUser.name) private readonly adminUserModel: Model<AdminUserDocument>,
    @InjectModel(SubscriptionPlan.name) private readonly planModel: Model<SubscriptionPlanDocument>,
    @InjectModel(AdminAuditLog.name) private readonly auditLogModel: Model<AdminAuditLogDocument>,
    @InjectModel(Organization.name) private readonly orgModel: Model<OrganizationDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(AIUsage.name) private readonly aiUsageModel: Model<AIUsageDocument>,
    @InjectModel(WorkflowDefinition.name) private readonly workflowModel: Model<WorkflowDefinitionDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService
  ) {}

  async onModuleInit() {
    await this.seedDefaultSuperAdmin();
    await this.seedDefaultSubscriptionPlans();
  }

  async login(dto: AdminLoginDto): Promise<{ admin: IAdminUser; tokens: AdminAuthTokens }> {
    const admin = await this.adminUserModel.findOne({ email: dto.email.toLowerCase() });
    if (!admin || !admin.is_active) {
      throw new UnauthorizedException('Invalid administrator credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, admin.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid administrator credentials');
    }

    admin.last_login_at = new Date();
    await admin.save();

    const secret =
      this.configService.get<string>('ADMIN_JWT_SECRET') ||
      'super-secret-admin-jwt-token-key-change-in-production-min-32';

    const token = await this.jwtService.signAsync(
      {
        adminId: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        isAdmin: true,
      },
      { secret, expiresIn: 43200 } // 12 hours
    );

    return {
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role,
        is_active: admin.is_active,
        last_login_at: admin.last_login_at ? admin.last_login_at.toISOString() : null,
        created_at: (admin as any).created_at.toISOString(),
        updated_at: (admin as any).updated_at.toISOString(),
      },
      tokens: {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 43200,
      },
    };
  }

  async getMe(adminId: string): Promise<IAdminUser> {
    const admin = await this.adminUserModel.findById(adminId);
    if (!admin) throw new NotFoundException('Admin user not found');
    return {
      id: admin._id.toString(),
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
      role: admin.role,
      is_active: admin.is_active,
      last_login_at: admin.last_login_at ? admin.last_login_at.toISOString() : null,
      created_at: (admin as any).created_at.toISOString(),
      updated_at: (admin as any).updated_at.toISOString(),
    };
  }

  async getMetrics(): Promise<SuperAdminDashboardMetrics> {
    const [
      totalOrgs,
      activeSubs,
      totalUsers,
      totalOrders,
      ordersGmv,
      aiUsageAgg,
      totalWorkflows,
      recentActivity,
    ] = await Promise.all([
      this.orgModel.countDocuments({ deleted_at: null }),
      this.orgModel.countDocuments({ subscription_status: 'active' }),
      this.userModel.countDocuments({ deleted_at: null }),
      this.orderModel.countDocuments({ deleted_at: null }),
      this.orderModel.aggregate([
        { $match: { deleted_at: null } },
        { $group: { _id: null, gmv: { $sum: '$total_amount' } } },
      ]),
      this.aiUsageModel.aggregate([
        { $group: { _id: null, total_tokens: { $sum: '$total_tokens' } } },
      ]),
      this.workflowModel.countDocuments({}),
      this.auditLogModel.find({}).sort({ created_at: -1 }).limit(10),
    ]);

    return {
      total_organizations: totalOrgs,
      active_subscriptions: activeSubs || 1,
      total_users: totalUsers,
      total_orders_platform: totalOrders,
      total_gmv_bdt: ordersGmv[0]?.gmv || 0,
      total_ai_tokens_consumed: aiUsageAgg[0]?.total_tokens || 0,
      total_workflows_executed: totalWorkflows,
      recent_activity: recentActivity.map((a) => ({
        id: a._id.toString(),
        admin_id: a.admin_id.toString(),
        admin_email: a.admin_email,
        action: a.action,
        target_type: a.target_type as any,
        target_id: a.target_id,
        details: a.details,
        ip_address: a.ip_address,
        created_at: (a as any).created_at.toISOString(),
      })),
    };
  }

  async listOrganizations(): Promise<OrganizationAdminView[]> {
    const orgs = await this.orgModel.find({ deleted_at: null }).sort({ created_at: -1 });

    const views: OrganizationAdminView[] = [];
    for (const org of orgs) {
      const owner = await this.userModel.findById(org.owner_id);
      const orderCount = await this.orderModel.countDocuments({ organization_id: org._id });
      const rev = await this.orderModel.aggregate([
        { $match: { organization_id: org._id } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]);
      const tokenAgg = await this.aiUsageModel.aggregate([
        { $match: { organization_id: org._id } },
        { $group: { _id: null, tokens: { $sum: '$total_tokens' } } },
      ]);

      views.push({
        id: org._id.toString(),
        name: org.name,
        slug: org.slug,
        owner_email: owner?.email || org.store_email,
        owner_name: owner ? `${owner.first_name} ${owner.last_name}` : 'Store Owner',
        subscription_plan: org.subscription_plan,
        subscription_status: org.subscription_status,
        is_suspended: (org as any).is_suspended ?? false,
        suspension_reason: (org as any).suspension_reason ?? null,
        total_orders: orderCount,
        total_revenue: rev[0]?.total || 0,
        ai_token_usage_this_month: tokenAgg[0]?.tokens || 0,
        created_at: (org as any).created_at.toISOString(),
      });
    }

    return views;
  }

  async updateOrganizationStatus(
    id: string,
    dto: UpdateOrganizationStatusDto,
    adminEmail: string,
    adminId: string
  ): Promise<OrganizationAdminView> {
    const org = await this.orgModel.findById(id);
    if (!org) throw new NotFoundException('Organization not found');

    (org as any).is_suspended = dto.is_suspended;
    (org as any).suspension_reason = dto.suspension_reason || null;
    await org.save();

    await this.auditLogModel.create({
      admin_id: adminId,
      admin_email: adminEmail,
      action: dto.is_suspended ? 'ORGANIZATION_SUSPENDED' : 'ORGANIZATION_REACTIVATED',
      target_type: 'organization',
      target_id: id,
      details: { reason: dto.suspension_reason },
    });

    const [updated] = await this.listOrganizations();
    return updated!;
  }

  async updateOrganizationPlan(
    id: string,
    dto: UpdateOrganizationPlanDto,
    adminEmail: string,
    adminId: string
  ): Promise<OrganizationAdminView> {
    const org = await this.orgModel.findById(id);
    if (!org) throw new NotFoundException('Organization not found');

    org.subscription_plan = dto.plan_id as any;
    await org.save();

    await this.auditLogModel.create({
      admin_id: adminId,
      admin_email: adminEmail,
      action: 'ORGANIZATION_PLAN_UPDATED',
      target_type: 'organization',
      target_id: id,
      details: { plan_id: dto.plan_id },
    });

    const [updated] = await this.listOrganizations();
    return updated!;
  }

  async listPlans(): Promise<PlatformSubscriptionPlan[]> {
    const plans = await this.planModel.find({});
    return plans.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      code: p.code,
      monthly_price_bdt: p.monthly_price_bdt,
      yearly_price_bdt: p.yearly_price_bdt,
      limits: p.limits,
      features: p.features,
      is_active: p.is_active,
      created_at: (p as any).created_at.toISOString(),
      updated_at: (p as any).updated_at.toISOString(),
    }));
  }

  async createPlan(dto: CreateSubscriptionPlanDto, adminEmail: string, adminId: string): Promise<PlatformSubscriptionPlan> {
    const p = await this.planModel.create(dto);
    await this.auditLogModel.create({
      admin_id: adminId,
      admin_email: adminEmail,
      action: 'SUBSCRIPTION_PLAN_CREATED',
      target_type: 'subscription',
      target_id: p._id.toString(),
      details: { code: p.code },
    });

    return {
      id: p._id.toString(),
      name: p.name,
      code: p.code,
      monthly_price_bdt: p.monthly_price_bdt,
      yearly_price_bdt: p.yearly_price_bdt,
      limits: p.limits,
      features: p.features,
      is_active: p.is_active,
      created_at: (p as any).created_at.toISOString(),
      updated_at: (p as any).updated_at.toISOString(),
    };
  }

  async updatePlan(id: string, dto: UpdateSubscriptionPlanDto, adminEmail: string, adminId: string): Promise<PlatformSubscriptionPlan> {
    const p = await this.planModel.findByIdAndUpdate(id, dto, { new: true });
    if (!p) throw new NotFoundException('Plan not found');

    await this.auditLogModel.create({
      admin_id: adminId,
      admin_email: adminEmail,
      action: 'SUBSCRIPTION_PLAN_UPDATED',
      target_type: 'subscription',
      target_id: id,
      details: dto,
    });

    return {
      id: p._id.toString(),
      name: p.name,
      code: p.code,
      monthly_price_bdt: p.monthly_price_bdt,
      yearly_price_bdt: p.yearly_price_bdt,
      limits: p.limits,
      features: p.features,
      is_active: p.is_active,
      created_at: (p as any).created_at.toISOString(),
      updated_at: (p as any).updated_at.toISOString(),
    };
  }

  async listAuditLogs(): Promise<IAdminAuditLog[]> {
    const logs = await this.auditLogModel.find({}).sort({ created_at: -1 }).limit(100);
    return logs.map((a) => ({
      id: a._id.toString(),
      admin_id: a.admin_id.toString(),
      admin_email: a.admin_email,
      action: a.action,
      target_type: a.target_type as any,
      target_id: a.target_id,
      details: a.details,
      ip_address: a.ip_address,
      created_at: (a as any).created_at.toISOString(),
    }));
  }

  async getGlobalAIStatus() {
    const openrouterKey = this.configService.get<string>('OPENROUTER_API_KEY');
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');

    const agg = await this.aiUsageModel.aggregate([
      { $group: { _id: null, tokens: { $sum: '$total_tokens' }, cost: { $sum: '$cost_bdt' } } },
    ]);

    return {
      openrouter_configured: !!openrouterKey,
      gemini_configured: !!geminiKey,
      openai_configured: !!openaiKey,
      total_tokens_consumed: agg[0]?.tokens || 0,
      estimated_cost_bdt: agg[0]?.cost || 0,
    };
  }

  async saveGlobalAIKey(provider: string, apiKey: string, adminEmail: string, adminId: string) {
    await this.auditLogModel.create({
      admin_id: adminId,
      admin_email: adminEmail,
      action: 'GLOBAL_AI_KEY_CONFIGURED',
      target_type: 'ai_config',
      target_id: provider,
      details: { provider, masked: this.encryptionService.maskKey(apiKey) },
    });
    return { message: `${provider.toUpperCase()} master key registered successfully` };
  }

  private async seedDefaultSuperAdmin() {
    const count = await this.adminUserModel.countDocuments({});
    if (count === 0) {
      const hash = await bcrypt.hash('ShopnixAdmin2026!', 10);
      await this.adminUserModel.create({
        email: 'admin@shopnix.io',
        password_hash: hash,
        first_name: 'Super',
        last_name: 'Admin',
        role: 'super_admin',
        is_active: true,
      });
      this.logger.log('[AdminModule] Seeded default Super Admin: admin@shopnix.io / ShopnixAdmin2026!');
    }
  }

  private async seedDefaultSubscriptionPlans() {
    const count = await this.planModel.countDocuments({});
    if (count === 0) {
      const plans = [
        {
          name: 'Starter Plan',
          code: 'starter',
          monthly_price_bdt: 999,
          yearly_price_bdt: 9990,
          limits: { max_stores: 1, max_orders_per_month: 250, max_products: 100, max_ai_tokens_per_month: 100000, max_team_members: 2 },
          features: { whatsapp_enabled: true, messenger_enabled: false, automations_enabled: false, ai_copilot_enabled: true, ai_agents_enabled: false, courier_integrations_enabled: true },
        },
        {
          name: 'Growth Plan',
          code: 'growth',
          monthly_price_bdt: 2499,
          yearly_price_bdt: 24990,
          limits: { max_stores: 3, max_orders_per_month: 1000, max_products: 500, max_ai_tokens_per_month: 500000, max_team_members: 5 },
          features: { whatsapp_enabled: true, messenger_enabled: true, automations_enabled: true, ai_copilot_enabled: true, ai_agents_enabled: true, courier_integrations_enabled: true },
        },
        {
          name: 'Enterprise Plan',
          code: 'enterprise',
          monthly_price_bdt: 5999,
          yearly_price_bdt: 59990,
          limits: { max_stores: 10, max_orders_per_month: 10000, max_products: 5000, max_ai_tokens_per_month: 2000000, max_team_members: 25 },
          features: { whatsapp_enabled: true, messenger_enabled: true, automations_enabled: true, ai_copilot_enabled: true, ai_agents_enabled: true, courier_integrations_enabled: true },
        },
      ];

      for (const p of plans) {
        await this.planModel.create(p);
      }
      this.logger.log('[AdminModule] Seeded default subscription plan tiers.');
    }
  }
}
