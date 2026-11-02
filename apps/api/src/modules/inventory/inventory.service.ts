import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InventoryMovement, InventoryMovementDocument } from './inventory-movement.schema';
import { Product, ProductDocument } from '../products/product.schema';
import type { StockAdjustmentInput } from '@shopnix/schemas';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryMovement.name)
    private movementModel: Model<InventoryMovementDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>
  ) {}

  async listMovements(
    organizationId: string | Types.ObjectId,
    productId?: string
  ): Promise<InventoryMovementDocument[]> {
    const query: Record<string, unknown> = {
      organization_id: new Types.ObjectId(String(organizationId)),
    };

    if (productId) {
      query.product_id = new Types.ObjectId(productId);
    }

    return this.movementModel.find(query).sort({ created_at: -1 }).limit(100).exec();
  }

  async adjustStock(
    organizationId: string | Types.ObjectId,
    input: StockAdjustmentInput,
    authorId?: string | Types.ObjectId
  ): Promise<InventoryMovementDocument> {
    const orgId = new Types.ObjectId(String(organizationId));
    const prodId = new Types.ObjectId(input.product_id);

    const product = await this.productModel.findOne({
      _id: prodId,
      organization_id: orgId,
      deleted_at: null,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantityBefore = product.stock_quantity;
    const quantityAfter = quantityBefore + input.quantity_change;

    if (quantityAfter < 0) {
      throw new BadRequestException(
        `Insufficient stock. Current stock is ${quantityBefore}, cannot adjust by ${input.quantity_change}`
      );
    }

    product.stock_quantity = quantityAfter;
    await product.save();

    const movement = new this.movementModel({
      organization_id: orgId,
      product_id: prodId,
      variant_id: input.variant_id ? new Types.ObjectId(input.variant_id) : null,
      type: input.type,
      quantity_change: input.quantity_change,
      quantity_before: quantityBefore,
      quantity_after: quantityAfter,
      reference_type: 'manual_adjustment',
      note: input.note || 'Manual stock update',
      author_id: authorId ? new Types.ObjectId(String(authorId)) : null,
    });

    return movement.save();
  }
}
