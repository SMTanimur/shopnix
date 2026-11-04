import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { SubscriptionPlan, SubscriptionStatus } from '@shopnix/types';

export type OrganizationDocument = Organization & Document;

@Schema({ _id: false })
export class StoreAddressSchema {
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
export class OrganizationSettingsSchema {
  @Prop({ default: 'BDT' })
  currency!: string;

  @Prop({ default: '৳' })
  currency_symbol!: string;

  @Prop({ default: 'Asia/Dhaka' })
  timezone!: string;

  @Prop({ default: null })
  default_courier!: string;

  @Prop({ default: 5 })
  low_stock_alert_threshold!: number;
}

@Schema({ _id: false })
export class EmailConfigSchema {
  @Prop({ enum: ['smtp', 'resend', 'sendgrid'], default: 'smtp' })
  provider!: 'smtp' | 'resend' | 'sendgrid';

  @Prop({ default: false })
  enabled!: boolean;

  @Prop({ default: 'Shopnix Store' })
  from_name!: string;

  @Prop({ default: 'orders@shopnix.io' })
  from_email!: string;

  @Prop({ default: 'smtp.gmail.com' })
  smtp_host!: string;

  @Prop({ default: 587 })
  smtp_port!: number;

  @Prop({ default: '' })
  smtp_user!: string;

  @Prop({ default: '' })
  smtp_pass!: string;

  @Prop({ default: '' })
  api_key!: string;

  @Prop({ default: true })
  notify_on_new_order!: boolean;

  @Prop({ default: true })
  notify_on_courier_dispatch!: boolean;
}

@Schema({ _id: false })
export class EmailLogEntrySchema {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  to!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ default: 'custom' })
  template!: string;

  @Prop({ default: 'sent' })
  status!: string;

  @Prop({ default: 'smtp' })
  provider!: string;

  @Prop({ default: Date.now })
  sent_at!: Date;
}

@Schema({
  collection: 'organizations',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true },
})
export class Organization {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner_id!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  store_name!: string;

  @Prop({ required: true, trim: true })
  store_phone!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  store_email!: string;

  @Prop({ type: StoreAddressSchema, default: () => ({ address_line: 'Dhaka', city: 'Dhaka', zone: '', area: '' }) })
  store_address!: StoreAddressSchema;

  @Prop({ default: null })
  logo_url!: string;

  @Prop({
    enum: ['starter', 'growth', 'enterprise'],
    default: 'starter',
  })
  subscription_plan!: SubscriptionPlan;

  @Prop({
    enum: ['active', 'trial', 'past_due', 'cancelled'],
    default: 'trial',
  })
  subscription_status!: SubscriptionStatus;

  @Prop({ type: OrganizationSettingsSchema, default: () => ({}) })
  settings!: OrganizationSettingsSchema;

  @Prop({ type: EmailConfigSchema, default: () => ({}) })
  email_config!: EmailConfigSchema;

  @Prop({ type: [EmailLogEntrySchema], default: [] })
  email_logs!: EmailLogEntrySchema[];

  @Prop({ default: null })
  deleted_at!: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
