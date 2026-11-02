import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '@shopnix/types';
import {
  connectStoreSchema,
  updateStoreSchema,
  triggerStoreSyncSchema,
  type ConnectStoreInput,
  type UpdateStoreInput,
  type TriggerStoreSyncInput,
} from '@shopnix/schemas';
import { StoresService } from './stores.service';

@ApiTags('Store Integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'List all connected ecommerce stores for organization' })
  async listStores(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.storesService.listStores(user.organizationId);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific store integration details' })
  async getStore(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.storesService.getStore(user.organizationId, id);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Connect a new external store (Shopify, WooCommerce, Custom API)' })
  @UsePipes(new ZodValidationPipe(connectStoreSchema))
  async connectStore(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ConnectStoreInput
  ) {
    const data = await this.storesService.connectStore(user.organizationId, dto);
    return { success: true, data, message: 'Store connected successfully' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store integration configuration' })
  @UsePipes(new ZodValidationPipe(updateStoreSchema))
  async updateStore(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateStoreInput
  ) {
    const data = await this.storesService.updateStore(user.organizationId, id, dto);
    return { success: true, data, message: 'Store configuration updated' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect an ecommerce store integration' })
  async disconnectStore(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    await this.storesService.disconnectStore(user.organizationId, id);
    return { success: true, message: 'Store disconnected successfully' };
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Trigger manual synchronization for products, orders or full catalog' })
  @UsePipes(new ZodValidationPipe(triggerStoreSyncSchema))
  async triggerSync(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: TriggerStoreSyncInput
  ) {
    const data = await this.storesService.triggerSync(user.organizationId, id, dto);
    return { success: true, data };
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get synchronization audit history logs for store' })
  async getSyncLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.storesService.getSyncLogs(user.organizationId, id);
    return { success: true, data };
  }
}
