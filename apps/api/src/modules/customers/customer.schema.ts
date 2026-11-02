import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ _id: false })
export class CustomerAddressSchema {
  @Prop({ default: 'Home' })
  label!: string;

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

  @Prop({ default: false })
  is_default!: boolean;
}

@Schema({
  collection: 'customers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Customer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, index: true })
  phone_number!: string;

  @Prop({ default: null, trim: true })
  email!: string;

  @Prop({ type: [CustomerAddressSchema], default: [] })
  addresses!: CustomerAddressSchema[];

  @Prop({ default: 0 })
  total_orders!: number;

  @Prop({ default: 0 })
  completed_orders!: number;

  @Prop({ default: 0 })
  cancelled_orders!: number;

  @Prop({ default: 0 })
  returned_orders!: number;

  @Prop({ default: 0 })
  total_spent!: number;

  @Prop({ default: 0 })
  return_rate_percentage!: number;

  @Prop({ default: false, index: true })
  is_high_risk!: boolean;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ default: null })
  deleted_at!: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ organization_id: 1, phone_number: 1 }, { unique: true });
CustomerSchema.index({ organization_id: 1, total_spent: -1 });
CustomerSchema.index({ organization_id: 1, is_high_risk: 1 });
