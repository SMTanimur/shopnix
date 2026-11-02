export type ChannelType = 'whatsapp' | 'facebook_messenger';

export type MessageDirection = 'inbound' | 'outbound';

export type MessageType = 'text' | 'image' | 'template' | 'interactive' | 'order_card';

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'bot_handling';

export type AIMessagingMode = 'copilot' | 'approval' | 'auto' | 'disabled';

export interface InboxConversation {
  id: string;
  organization_id: string;
  channel: ChannelType;
  external_sender_id: string;
  customer_name: string;
  customer_phone?: string | null;
  customer_id?: string | null;
  status: ConversationStatus;
  assigned_user_id?: string | null;
  last_message_text: string;
  last_message_at: string;
  unread_count: number;
  ai_mode: AIMessagingMode;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface InboxMessage {
  id: string;
  organization_id: string;
  conversation_id: string;
  channel: ChannelType;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  media_url?: string | null;
  external_message_id?: string | null;
  is_ai_generated: boolean;
  ai_approval_status?: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;
}

export interface SendMessageDto {
  content: string;
  type?: MessageType;
  media_url?: string;
}

export interface UpdateConversationDto {
  status?: ConversationStatus;
  assigned_user_id?: string | null;
  ai_mode?: AIMessagingMode;
  tags?: string[];
}

export interface QuickOrderFromChatDto {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  zone?: string;
  items: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_charge: number;
  notes?: string;
}
