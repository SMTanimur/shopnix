import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { ProductStatus } from '@shopnix/types';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class ProductImageSchema {
  @Prop({ required: true })
  url!: string;

  @Prop({ default: '' })
  alt_text!: string;

  @Prop({ default: 0 })
  sort_order!: number;

  @Prop({ default: false })
  is_primary!: boolean;
}

@Schema({ _id: false })
export class VariantOptionSchema {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: [String], default: [] })
  values!: string[];
}

@Schema({
  collection: 'products',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'StoreIntegration',
    default: null,
    index: true,
  })
  store_id?: MongooseSchema.Types.ObjectId;

  @Prop({ default: null })
  source_platform?: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ default: '' })
  short_description!: string;

  @Prop({ required: true, uppercase: true, trim: true })
  sku!: string;

  @Prop({ default: null })
  barcode!: string;

  @Prop({
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
    index: true,
  })
  status!: ProductStatus;

  @Prop({ required: true, min: 0 })
  regular_price!: number;

  @Prop({ default: null, min: 0 })
  sale_price!: number;

  @Prop({ default: null, min: 0 })
  cost_price!: number;

  @Prop({ required: true, default: 0, min: 0 })
  stock_quantity!: number;

  @Prop({ default: 5, min: 0 })
  low_stock_threshold!: number;

  @Prop({ default: true })
  track_inventory!: boolean;

  @Prop({ type: [ProductImageSchema], default: [] })
  images!: ProductImageSchema[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category', default: [] })
  category_ids!: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ default: false })
  has_variants!: boolean;

  @Prop({ type: [VariantOptionSchema], default: [] })
  variant_options!: VariantOptionSchema[];

  @Prop({ default: null })
  weight!: number;

  @Prop({ enum: ['kg', 'g'], default: 'kg' })
  weight_unit!: string;

  @Prop({ default: null })
  seo_title!: string;

  @Prop({ default: null })
  seo_description!: string;

  @Prop({ type: [String], default: [] })
  seo_keywords!: string[];

  @Prop({ default: null })
  deleted_at!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ organization_id: 1, status: 1 });
ProductSchema.index({ organization_id: 1, sku: 1 }, { unique: true });
ProductSchema.index({ organization_id: 1, slug: 1 }, { unique: true });
ProductSchema.index({ organization_id: 1, stock_quantity: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
