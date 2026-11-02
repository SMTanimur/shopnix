import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@shopnix/types';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get aggregate executive dashboard metrics' })
  async getDashboardMetrics(
    @CurrentUser() user: AuthenticatedUser,
    @Query('range') range?: string
  ) {
    const metrics = await this.analyticsService.getDashboardMetrics(user.organizationId, range);
    return { success: true, data: metrics };
  }

  @Get('revenue-trends')
  @ApiOperation({ summary: 'Get daily revenue and order trends for chart rendering' })
  async getRevenueTrends(
    @CurrentUser() user: AuthenticatedUser,
    @Query('days') days?: string
  ) {
    const daysCount = days ? parseInt(days, 10) : 14;
    const trends = await this.analyticsService.getRevenueTrends(user.organizationId, daysCount);
    return { success: true, data: trends };
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top performing products ranked by volume and gross revenue' })
  async getTopProducts(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string
  ) {
    const limitCount = limit ? parseInt(limit, 10) : 5;
    const top = await this.analyticsService.getTopProducts(user.organizationId, limitCount);
    return { success: true, data: top };
  }
}
