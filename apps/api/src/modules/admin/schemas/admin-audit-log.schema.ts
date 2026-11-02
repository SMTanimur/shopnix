import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AdminAuditLogDocument = AdminAuditLog & Document;

@Schema({ collection: 'admin_audit_logs', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class AdminAuditLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AdminUser', required: true })
  admin_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  admin_email: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true, enum: ['organization', 'user', 'subscription', 'ai_config', 'system'] })
  target_type: string;

  @Prop({ required: true })
  target_id: string;

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;

  @Prop({ default: null })
  ip_address: string;
}

export const AdminAuditLogSchema = SchemaFactory.createForClass(AdminAuditLog);
AdminAuditLogSchema.index({ created_at: -1 });
