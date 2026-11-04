import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StoreIntegrationDocument = StoreIntegration & Document;

@Schema({ collection: 'store_integrations', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class StoreIntegration {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['shopify', 'woocommerce', 'daraz', 'custom', 'custom_api'],
  })
  platform: 'shopify' | 'woocommerce' | 'daraz' | 'custom' | 'custom_api';

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  store_url: string;

  @Prop({ type: String, default: null })
  logo_url: string | null;

  @Prop({ required: true, enum: ['connected', 'disconnected', 'error', 'syncing'], default: 'connected' })
  connection_status: 'connected' | 'disconnected' | 'error' | 'syncing';

  @Prop({ type: Object, default: {} })
  api_credentials_encrypted: Record<string, string>;

  @Prop({ default: true })
  auto_sync_enabled: boolean;

  @Prop({ default: 30 })
  sync_interval_minutes: number;

  @Prop({ type: Date, default: null })
  last_synced_at: Date | null;

  @Prop({ type: String, default: null, enum: ['success', 'failed', 'partial', null] })
  last_sync_status: string | null;

  @Prop({ type: String, default: null })
  last_sync_error: string | null;

  @Prop({ default: 0 })
  product_count: number;

  @Prop({ default: 0 })
  order_count: number;
}

export const StoreIntegrationSchema = SchemaFactory.createForClass(StoreIntegration);
StoreIntegrationSchema.index({ organization_id: 1, platform: 1 });
