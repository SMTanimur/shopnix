import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from '@shopnix/schemas';
import type { AuthenticatedUser, ProductFilterParams } from '@shopnix/types';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products with pagination, search, and status filters' })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() params: ProductFilterParams
  ) {
    const result = await this.productsService.list(user.organizationId, params);
    return { success: true, data: result.items, meta: result.meta };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single product by ID' })
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const product = await this.productsService.findById(user.organizationId, id);
    return { success: true, data: product };
  }

  @Post()
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Create a new product in the catalog' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createProductSchema)) input: CreateProductInput
  ) {
    const product = await this.productsService.create(user.organizationId, input);
    return { success: true, data: product };
  }

  @Patch(':id')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Update an existing product' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) input: UpdateProductInput
  ) {
    const product = await this.productsService.update(user.organizationId, id, input);
    return { success: true, data: product };
  }

  @Delete(':id')
  @Roles('owner', 'admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a product' })
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    await this.productsService.softDelete(user.organizationId, id);
    return { success: true, message: 'Product deleted successfully' };
  }

  @Post(':id/duplicate')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Duplicate an existing product as a draft' })
  async duplicate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const duplicated = await this.productsService.duplicate(user.organizationId, id);
    return { success: true, data: duplicated };
  }
}
