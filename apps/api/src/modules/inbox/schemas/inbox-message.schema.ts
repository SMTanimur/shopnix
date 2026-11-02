import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InboxMessageDocument = InboxMessage & Document;

@Schema({ collection: 'inbox_messages', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class InboxMessage {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organization_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'InboxConversation', required: true, index: true })
  conversation_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['whatsapp', 'facebook_messenger'] })
  channel: 'whatsapp' | 'facebook_messenger';

  @Prop({ required: true, enum: ['inbound', 'outbound'] })
  direction: 'inbound' | 'outbound';

  @Prop({ required: true, enum: ['text', 'image', 'template', 'interactive', 'order_card'], default: 'text' })
  type: 'text' | 'image' | 'template' | 'interactive' | 'order_card';

  @Prop({ required: true })
  content: string;

  @Prop({ default: null })
  media_url: string;

  @Prop({ default: null })
  external_message_id: string;

  @Prop({ default: false })
  is_ai_generated: boolean;

  @Prop({ default: null, enum: ['pending', 'approved', 'rejected', null] })
  ai_approval_status: string;
}

export const InboxMessageSchema = SchemaFactory.createForClass(InboxMessage);
InboxMessageSchema.index({ conversation_id: 1, created_at: 1 });
