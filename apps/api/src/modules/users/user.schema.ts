import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import type { UserRole } from '@shopnix/types';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User {
  @Prop({ required: true, trim: true })
  first_name!: string;

  @Prop({ required: true, trim: true })
  last_name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true, select: false })
  password_hash!: string;

  @Prop({ required: true, trim: true })
  phone_number!: string;

  @Prop({
    required: true,
    enum: ['owner', 'admin', 'manager', 'staff'],
    default: 'staff',
  })
  role!: UserRole;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organization_id!: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  is_active!: boolean;

  @Prop({ default: null })
  last_login_at!: Date;

  @Prop({ default: null })
  deleted_at!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Compound Indexes
UserSchema.index({ organization_id: 1, role: 1 });
UserSchema.index({ organization_id: 1, deleted_at: 1 });
