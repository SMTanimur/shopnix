import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WorkflowExecutionLogDocument = WorkflowExecutionLog & Document;

@Schema({ collection: 'automation_executions', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class WorkflowExecutionLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WorkflowDefinition', required: true, index: true })
  workflow_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['running', 'completed', 'failed', 'paused'], default: 'running' })
  status: string;

  @Prop({ type: Array, default: [] })
  steps: Array<{
    node_id: string;
    node_name: string;
    status: 'success' | 'failed' | 'skipped';
    input?: any;
    output?: any;
    error?: string;
    duration_ms: number;
  }>;

  @Prop({ default: 0 })
  duration_ms: number;

  @Prop({ default: null })
  error: string;
}

export const WorkflowExecutionLogSchema = SchemaFactory.createForClass(WorkflowExecutionLog);
WorkflowExecutionLogSchema.index({ workflow_id: 1, created_at: -1 });
