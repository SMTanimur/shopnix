import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { stockAdjustmentSchema, type StockAdjustmentInput } from '@shopnix/schemas';
import type { AuthenticatedUser } from '@shopnix/types';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('movements')
  @ApiOperation({ summary: 'List inventory movement audit history' })
  async listMovements(
    @CurrentUser() user: AuthenticatedUser,
    @Query('product_id') productId?: string
  ) {
    const movements = await this.inventoryService.listMovements(user.organizationId, productId);
    return { success: true, data: movements };
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Record manual stock adjustment with delta and audit trail' })
  async adjustStock(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(stockAdjustmentSchema)) input: StockAdjustmentInput
  ) {
    const movement = await this.inventoryService.adjustStock(
      user.organizationId,
      input,
      user.userId
    );
    return { success: true, data: movement };
  }
}
