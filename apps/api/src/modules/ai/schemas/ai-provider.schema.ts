import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AIProviderDocument = AIProvider & Document;

@Schema({ collection: 'ai_providers', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AIProvider {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', default: null, index: true })
  organization_id: MongooseSchema.Types.ObjectId | null;

  @Prop({ required: true, enum: ['gemini', 'openrouter', 'openai'] })
  provider: 'gemini' | 'openrouter' | 'openai';

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: '' })
  api_key_encrypted: string;

  @Prop({ required: true, default: 'google/gemini-2.0-flash-exp:free' })
  default_model: string;

  @Prop({ default: true })
  free_models_only: boolean;
}

export const AIProviderSchema = SchemaFactory.createForClass(AIProvider);
AIProviderSchema.index({ organization_id: 1, provider: 1 }, { unique: true });
