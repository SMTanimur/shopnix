import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  type CreateOrderInput,
  type UpdateOrderStatusInput,
} from '@shopnix/schemas';
import type { AuthenticatedUser, OrderFilterParams } from '@shopnix/types';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List orders with pagination, search, status, and date filters' })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() params: OrderFilterParams
  ) {
    const result = await this.ordersService.list(user.organizationId, params);
    return { success: true, data: result.items, meta: result.meta };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single order with timeline and line items' })
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const order = await this.ordersService.findById(user.organizationId, id);
    return { success: true, data: order };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createOrderSchema)) input: CreateOrderInput
  ) {
    const order = await this.ordersService.create(user.organizationId, input, user.userId);
    return { success: true, data: order };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition order status (with state machine validation)' })
  async updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema)) input: UpdateOrderStatusInput
  ) {
    const order = await this.ordersService.updateStatus(user.organizationId, id, input, user.userId);
    return { success: true, data: order };
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add an internal staff note to an order' })
  async addNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body('note') note: string
  ) {
    const order = await this.ordersService.addNote(
      user.organizationId,
      id,
      note,
      user.userId,
      `${user.firstName} ${user.lastName}`
    );
    return { success: true, data: order };
  }
}
