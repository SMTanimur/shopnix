import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@shopnix/types';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItemSchema {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product_id!: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariant', default: null })
  variant_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  sku!: string;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  unit_price!: number;

  @Prop({ required: true, min: 0 })
  total_price!: number;

  @Prop({ default: null })
  image_url!: string;
}

@Schema({ _id: false })
export class ShippingAddressSchema {
  @Prop({ required: true })
  address_line!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ default: '' })
  zone!: string;

  @Prop({ default: '' })
  area!: string;

  @Prop({ default: null })
  postal_code!: string;
}

@Schema({ _id: false })
export class OrderTimelineEventSchema {
  @Prop({ required: true })
  status!: string;

  @Prop({ required: true })
  note!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  author_id!: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  created_at!: Date;
}

@Schema({ _id: false })
export class OrderNoteSchema {
  @Prop({ required: true })
  content!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  author_name!: string;

  @Prop({ default: Date.now })
  created_at!: Date;
}

@Schema({
  collection: 'orders',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Order {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  order_number!: string;

  @Prop({
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true,
  })
  status!: OrderStatus;

  @Prop({
    enum: ['unpaid', 'paid', 'partial', 'refunded'],
    default: 'unpaid',
  })
  payment_status!: PaymentStatus;

  @Prop({
    enum: ['cod', 'bkash', 'nagad', 'bank_transfer', 'card'],
    default: 'cod',
  })
  payment_method!: PaymentMethod;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true, index: true })
  customer_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  customer_name!: string;

  @Prop({ required: true, trim: true, index: true })
  customer_phone!: string;

  @Prop({ default: null, trim: true })
  customer_email!: string;

  @Prop({ type: ShippingAddressSchema, required: true })
  shipping_address!: ShippingAddressSchema;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItemSchema[];

  @Prop({ required: true, min: 0 })
  subtotal!: number;

  @Prop({ default: 0, min: 0 })
  shipping_charge!: number;

  @Prop({ default: 0, min: 0 })
  discount_amount!: number;

  @Prop({ required: true, min: 0 })
  total_amount!: number;

  @Prop({ required: true, min: 0 })
  cod_amount!: number;

  @Prop({ default: null })
  courier_provider!: string;

  @Prop({ default: null })
  consignment_id!: string;

  @Prop({ default: null })
  tracking_code!: string;

  @Prop({ default: null })
  courier_status!: string;

  @Prop({ type: [OrderTimelineEventSchema], default: [] })
  timeline!: OrderTimelineEventSchema[];

  @Prop({ type: [OrderNoteSchema], default: [] })
  notes!: OrderNoteSchema[];

  @Prop({ default: null })
  deleted_at!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ organization_id: 1, order_number: 1 }, { unique: true });
OrderSchema.index({ organization_id: 1, status: 1, created_at: -1 });
OrderSchema.index({ organization_id: 1, customer_phone: 1 });
OrderSchema.index({ organization_id: 1, consignment_id: 1 });
OrderSchema.index({ organization_id: 1, created_at: -1 });
