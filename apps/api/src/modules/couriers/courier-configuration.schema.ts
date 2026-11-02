import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { CourierProviderName } from '@shopnix/types';

export type CourierConfigurationDocument = CourierConfiguration & Document;

@Schema({
  collection: 'courier_configurations',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class CourierConfiguration {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['steadfast', 'pathao', 'redx', 'ecourier', 'sandbox'],
  })
  provider!: CourierProviderName;

  @Prop({ default: true })
  is_active!: boolean;

  @Prop({ type: Object, default: {} })
  credentials!: Record<string, string>;

  @Prop({ default: null })
  default_pickup_store_id!: string;

  @Prop({ default: null })
  default_delivery_type!: string;
}

export const CourierConfigurationSchema = SchemaFactory.createForClass(CourierConfiguration);

CourierConfigurationSchema.index({ organization_id: 1, provider: 1 }, { unique: true });
