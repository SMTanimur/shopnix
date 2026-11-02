import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WorkflowDefinitionDocument = WorkflowDefinition & Document;

@Schema({ collection: 'automation_workflows', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class WorkflowDefinition {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ required: true })
  trigger_type: string;

  @Prop({ type: Array, default: [] })
  nodes: Array<any>;

  @Prop({ type: Array, default: [] })
  edges: Array<any>;

  @Prop({ default: 0 })
  execution_count: number;

  @Prop({ default: null })
  last_executed_at: Date;
}

export const WorkflowDefinitionSchema = SchemaFactory.createForClass(WorkflowDefinition);
WorkflowDefinitionSchema.index({ organization_id: 1, trigger_type: 1 });
