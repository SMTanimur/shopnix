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
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from '@shopnix/schemas';
import type { AuthenticatedUser, CustomerFilterParams } from '@shopnix/types';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List customers with LTV and risk indicators' })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() params: CustomerFilterParams
  ) {
    const result = await this.customersService.list(user.organizationId, params);
    return { success: true, data: result.items, meta: result.meta };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer profile' })
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const customer = await this.customersService.findById(user.organizationId, id);
    return { success: true, data: customer };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer profile' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createCustomerSchema)) input: CreateCustomerInput
  ) {
    const customer = await this.customersService.create(user.organizationId, input);
    return { success: true, data: customer };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer details' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCustomerSchema)) input: UpdateCustomerInput
  ) {
    const customer = await this.customersService.update(user.organizationId, id, input);
    return { success: true, data: customer };
  }
}
