import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InboxConversationDocument = InboxConversation & Document;

@Schema({ collection: 'inbox_conversations', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class InboxConversation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['whatsapp', 'facebook_messenger'] })
  channel: 'whatsapp' | 'facebook_messenger';

  @Prop({ required: true, index: true })
  external_sender_id: string;

  @Prop({ required: true })
  customer_name: string;

  @Prop({ default: null })
  customer_phone: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', default: null })
  customer_id: MongooseSchema.Types.ObjectId | null;

  @Prop({ required: true, enum: ['open', 'pending', 'resolved', 'bot_handling'], default: 'open' })
  status: 'open' | 'pending' | 'resolved' | 'bot_handling';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  assigned_user_id: MongooseSchema.Types.ObjectId | null;

  @Prop({ default: '' })
  last_message_text: string;

  @Prop({ default: () => new Date() })
  last_message_at: Date;

  @Prop({ default: 0 })
  unread_count: number;

  @Prop({ required: true, enum: ['copilot', 'approval', 'auto', 'disabled'], default: 'copilot' })
  ai_mode: 'copilot' | 'approval' | 'auto' | 'disabled';

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const InboxConversationSchema = SchemaFactory.createForClass(InboxConversation);
InboxConversationSchema.index({ organization_id: 1, channel: 1, external_sender_id: 1 }, { unique: true });
InboxConversationSchema.index({ organization_id: 1, last_message_at: -1 });
