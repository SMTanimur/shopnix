import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  adminLoginSchema,
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  updateOrganizationStatusSchema,
  updateOrganizationPlanSchema,
  type AdminLoginInput,
  type CreateSubscriptionPlanInput,
  type UpdateSubscriptionPlanInput,
  type UpdateOrganizationStatusInput,
  type UpdateOrganizationPlanInput,
} from '@shopnix/schemas';
import { AdminService } from './admin.service';

@ApiTags('Super Admin Control Center')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Super Admin authentication endpoint' })
  @UsePipes(new ZodValidationPipe(adminLoginSchema))
  async login(@Body() dto: AdminLoginInput) {
    const data = await this.adminService.login(dto);
    return { success: true, data };
  }

  @Get('auth/me')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated super admin profile' })
  async getMe(@Req() req: any) {
    const data = await this.adminService.getMe(req.admin.adminId);
    return { success: true, data };
  }

  @Get('metrics')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get global platform analytics KPIs' })
  async getMetrics() {
    const data = await this.adminService.getMetrics();
    return { success: true, data };
  }

  @Get('organizations')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'List all tenant organizations with usage and subscription' })
  async listOrganizations() {
    const data = await this.adminService.listOrganizations();
    return { success: true, data };
  }

  @Patch('organizations/:id/status')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Suspend or reactivate an organization' })
  @UsePipes(new ZodValidationPipe(updateOrganizationStatusSchema))
  async updateOrganizationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationStatusInput,
    @Req() req: any
  ) {
    const data = await this.adminService.updateOrganizationStatus(
      id,
      dto,
      req.admin.email,
      req.admin.adminId
    );
    return { success: true, data, message: 'Organization status updated' };
  }

  @Patch('organizations/:id/plan')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Update organization subscription plan entitlements' })
  @UsePipes(new ZodValidationPipe(updateOrganizationPlanSchema))
  async updateOrganizationPlan(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationPlanInput,
    @Req() req: any
  ) {
    const data = await this.adminService.updateOrganizationPlan(
      id,
      dto,
      req.admin.email,
      req.admin.adminId
    );
    return { success: true, data, message: 'Organization plan updated' };
  }

  @Get('subscriptions')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'List all SaaS subscription plans' })
  async listPlans() {
    const data = await this.adminService.listPlans();
    return { success: true, data };
  }

  @Post('subscriptions')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new subscription plan tier' })
  @UsePipes(new ZodValidationPipe(createSubscriptionPlanSchema))
  async createPlan(
    @Body() dto: CreateSubscriptionPlanInput,
    @Req() req: any
  ) {
    const data = await this.adminService.createPlan(dto, req.admin.email, req.admin.adminId);
    return { success: true, data, message: 'Subscription plan created' };
  }

  @Patch('subscriptions/:id')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Update subscription plan limits and feature flags' })
  @UsePipes(new ZodValidationPipe(updateSubscriptionPlanSchema))
  async updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionPlanInput,
    @Req() req: any
  ) {
    const data = await this.adminService.updatePlan(id, dto, req.admin.email, req.admin.adminId);
    return { success: true, data, message: 'Subscription plan updated' };
  }

  @Get('audit-logs')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve immutable platform audit logs' })
  async listAuditLogs() {
    const data = await this.adminService.listAuditLogs();
    return { success: true, data };
  }

  @Get('ai/status')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get global AI provider infrastructure status' })
  async getGlobalAIStatus() {
    const data = await this.adminService.getGlobalAIStatus();
    return { success: true, data };
  }

  @Post('ai/keys')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Register or update platform master AI provider key' })
  async saveGlobalAIKey(@Body() body: { provider: string; api_key: string }, @Req() req: any) {
    const data = await this.adminService.saveGlobalAIKey(
      body.provider,
      body.api_key,
      req.admin.email,
      req.admin.adminId
    );
    return { success: true, data };
  }
}
