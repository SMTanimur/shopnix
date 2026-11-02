import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { InventoryMovementType } from '@shopnix/types';

export type InventoryMovementDocument = InventoryMovement & Document;

@Schema({
  collection: 'inventory_movements',
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class InventoryMovement {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true, index: true })
  product_id!: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariant', default: null })
  variant_id!: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['sale', 'restock', 'adjustment', 'return', 'initial'],
  })
  type!: InventoryMovementType;

  @Prop({ required: true })
  quantity_change!: number;

  @Prop({ required: true })
  quantity_before!: number;

  @Prop({ required: true })
  quantity_after!: number;

  @Prop({
    required: true,
    enum: ['order', 'manual_adjustment', 'import'],
    default: 'manual_adjustment',
  })
  reference_type!: string;

  @Prop({ default: null })
  reference_id!: string;

  @Prop({ default: null })
  note!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  author_id!: MongooseSchema.Types.ObjectId;
}

export const InventoryMovementSchema = SchemaFactory.createForClass(InventoryMovement);

InventoryMovementSchema.index({ organization_id: 1, product_id: 1, created_at: -1 });
InventoryMovementSchema.index({ organization_id: 1, created_at: -1 });
