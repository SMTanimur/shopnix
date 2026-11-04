import { Controller, Get, Patch, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { updateOrganizationSchema, type UpdateOrganizationInput } from '@shopnix/schemas';
import type { AuthenticatedUser } from '@shopnix/types';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current organization details' })
  async getCurrent(@CurrentUser() user: AuthenticatedUser) {
    const org = await this.orgsService.findById(user.organizationId);
    return { success: true, data: org };
  }

  @Patch('current')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Update organization store profile & settings' })
  async updateCurrent(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(updateOrganizationSchema)) input: UpdateOrganizationInput
  ) {
    const org = await this.orgsService.update(user.organizationId, input);
    return { success: true, data: org };
  }

  @Get('current/notifications')
  @ApiOperation({ summary: 'Get real-time operational notifications for organization' })
  async getNotifications(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.orgsService.getNotifications(user.organizationId);
    return { success: true, data };
  }

  @Get('current/email-config')
  @ApiOperation({ summary: 'Get email provider configuration & recent email delivery logs' })
  async getEmailConfig(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.orgsService.getEmailConfig(user.organizationId);
    return { success: true, data };
  }

  @Put('current/email-config')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Connect or update SMTP / Resend / SendGrid email provider settings' })
  async updateEmailConfig(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Record<string, any>
  ) {
    const data = await this.orgsService.updateEmailConfig(user.organizationId, body);
    return { success: true, data, message: 'Email provider configuration saved' };
  }

  @Post('current/email-send')
  @ApiOperation({ summary: 'Send a transactional or custom email via connected provider' })
  async sendEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { to: string; subject: string; template?: string; body?: string }
  ) {
    const data = await this.orgsService.sendEmail(user.organizationId, body);
    return { success: true, data, message: `Email dispatched to ${body.to}` };
  }
}
