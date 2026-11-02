import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouriersService } from './couriers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  configureCourierSchema,
  dispatchCourierSchema,
  type ConfigureCourierInput,
  type DispatchCourierInput,
} from '@shopnix/schemas';
import type { AuthenticatedUser } from '@shopnix/types';

@ApiTags('Couriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('couriers')
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @Get('configs')
  @ApiOperation({ summary: 'List all courier provider configurations for the store' })
  async getConfigs(@CurrentUser() user: AuthenticatedUser) {
    const configs = await this.couriersService.listConfigs(user.organizationId);
    return { success: true, data: configs };
  }

  @Post('configure')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Save or update credentials for a courier provider' })
  async configure(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(configureCourierSchema)) input: ConfigureCourierInput
  ) {
    const config = await this.couriersService.configure(user.organizationId, input);
    return { success: true, data: config };
  }

  @Post('dispatch')
  @ApiOperation({ summary: 'Book an order consignment directly with the selected courier' })
  async dispatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(dispatchCourierSchema)) input: DispatchCourierInput
  ) {
    const result = await this.couriersService.dispatch(user.organizationId, input);
    return { success: true, data: result };
  }

  @Get('track/:consignment_id')
  @ApiOperation({ summary: 'Track shipment status by consignment ID' })
  async track(
    @CurrentUser() user: AuthenticatedUser,
    @Param('consignment_id') consignmentId: string
  ) {
    const tracking = await this.couriersService.track(user.organizationId, consignmentId);
    return { success: true, data: tracking };
  }
}
