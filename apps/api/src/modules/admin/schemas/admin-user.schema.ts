import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminUserDocument = AdminUser & Document;

@Schema({ collection: 'admin_users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AdminUser {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, enum: ['super_admin', 'support_admin', 'billing_admin'], default: 'super_admin' })
  role: 'super_admin' | 'support_admin' | 'billing_admin';

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Date, default: null })
  last_login_at: Date | null;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
