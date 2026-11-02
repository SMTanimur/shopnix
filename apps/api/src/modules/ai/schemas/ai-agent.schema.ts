import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AIAgentDocument = AIAgent & Document;

@Schema({ collection: 'ai_agents', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AIAgent {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: 'sales_agent' })
  role: string;

  @Prop({ required: true })
  system_prompt: string;

  @Prop({ default: 'openrouter' })
  provider: string;

  @Prop({ default: 'google/gemini-2.0-flash-exp:free' })
  model: string;

  @Prop({ type: [String], default: [] })
  allowed_tools: string[];

  @Prop({ default: true })
  is_active: boolean;
}

export const AIAgentSchema = SchemaFactory.createForClass(AIAgent);
AIAgentSchema.index({ organization_id: 1, role: 1 });
