import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductVariantDocument = ProductVariant & Document;

@Schema({
  collection: 'product_variants',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ProductVariant {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true, index: true })
  product_id!: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  sku!: string;

  @Prop({ default: null })
  barcode!: string;

  @Prop({ type: Object, required: true })
  option_values!: Record<string, string>;

  @Prop({ required: true, min: 0 })
  regular_price!: number;

  @Prop({ default: null, min: 0 })
  sale_price!: number;

  @Prop({ default: null, min: 0 })
  cost_price!: number;

  @Prop({ required: true, default: 0, min: 0 })
  stock_quantity!: number;

  @Prop({ default: null })
  image_url!: string;

  @Prop({ default: true })
  is_active!: boolean;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

ProductVariantSchema.index({ organization_id: 1, sku: 1 }, { unique: true });
