import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StoreSyncLogDocument = StoreSyncLog & Document;

@Schema({ collection: 'store_sync_logs', timestamps: { createdAt: 'started_at', updatedAt: false } })
export class StoreSyncLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'StoreIntegration', required: true, index: true })
  store_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['products', 'orders', 'inventory', 'full'] })
  sync_type: string;

  @Prop({ required: true, enum: ['running', 'success', 'failed', 'partial'], default: 'running' })
  status: string;

  @Prop({ default: 0 })
  items_fetched: number;

  @Prop({ default: 0 })
  items_created: number;

  @Prop({ default: 0 })
  items_updated: number;

  @Prop({ default: 0 })
  items_failed: number;

  @Prop({ type: Array, default: [] })
  errors: Array<{ item_id?: string; message: string }>;

  @Prop({ default: 0 })
  duration_ms: number;

  @Prop({ default: null })
  completed_at: Date;
}

export const StoreSyncLogSchema = SchemaFactory.createForClass(StoreSyncLog);
StoreSyncLogSchema.index({ store_id: 1, started_at: -1 });
