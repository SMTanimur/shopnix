import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AIUsageDocument = AIUsage & Document;

@Schema({ collection: 'ai_usage_records', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class AIUsage {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  user_id: MongooseSchema.Types.ObjectId | null;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  feature: string;

  @Prop({ default: 0 })
  prompt_tokens: number;

  @Prop({ default: 0 })
  completion_tokens: number;

  @Prop({ default: 0 })
  total_tokens: number;

  @Prop({ default: 0 })
  duration_ms: number;

  @Prop({ default: 0 })
  cost_bdt: number;

  @Prop({ default: true })
  success: boolean;
}

export const AIUsageSchema = SchemaFactory.createForClass(AIUsage);
AIUsageSchema.index({ organization_id: 1, created_at: -1 });
AIUsageSchema.index({ provider: 1, created_at: -1 });
