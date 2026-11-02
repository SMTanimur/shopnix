import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  InboxConversation as IInboxConversation,
  InboxMessage as IInboxMessage,
  SendMessageDto,
  UpdateConversationDto,
  QuickOrderFromChatDto,
  Order as IOrder,
} from '@shopnix/types';
import { InboxConversation, type InboxConversationDocument } from './schemas/inbox-conversation.schema';
import { InboxMessage, type InboxMessageDocument } from './schemas/inbox-message.schema';
import { Order, type OrderDocument } from '../orders/order.schema';
import { Customer, type CustomerDocument } from '../customers/customer.schema';
import { WhatsAppGateway } from './gateways/whatsapp.gateway';
import { MessengerGateway } from './gateways/messenger.gateway';
import { AIModelRouterService } from '../ai/router/ai-model-router.service';

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);

  constructor(
    @InjectModel(InboxConversation.name)
    private readonly conversationModel: Model<InboxConversationDocument>,
    @InjectModel(InboxMessage.name)
    private readonly messageModel: Model<InboxMessageDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    private readonly whatsAppGateway: WhatsAppGateway,
    private readonly messengerGateway: MessengerGateway,
    private readonly aiRouterService: AIModelRouterService
  ) {}

  async listConversations(
    organizationId: string,
    params?: { channel?: string; status?: string }
  ): Promise<IInboxConversation[]> {
    const query: Record<string, any> = { organization_id: organizationId };
    if (params?.channel) query.channel = params.channel;
    if (params?.status) query.status = params.status;

    let conversations = await this.conversationModel
      .find(query)
      .sort({ last_message_at: -1 });

    // Seed realistic sample conversations if empty
    if (conversations.length === 0) {
      await this.seedSampleConversations(organizationId);
      conversations = await this.conversationModel
        .find(query)
        .sort({ last_message_at: -1 });
    }

    return conversations.map(this.mapConversationDocument);
  }

  async getConversation(organizationId: string, id: string): Promise<IInboxConversation> {
    const doc = await this.conversationModel.findOne({ _id: id, organization_id: organizationId });
    if (!doc) throw new NotFoundException('Conversation not found');
    return this.mapConversationDocument(doc);
  }

  async updateConversation(
    organizationId: string,
    id: string,
    dto: UpdateConversationDto
  ): Promise<IInboxConversation> {
    const doc = await this.conversationModel.findOneAndUpdate(
      { _id: id, organization_id: organizationId },
      dto,
      { new: true }
    );
    if (!doc) throw new NotFoundException('Conversation not found');
    return this.mapConversationDocument(doc);
  }

  async listMessages(organizationId: string, conversationId: string): Promise<IInboxMessage[]> {
    const messages = await this.messageModel
      .find({ organization_id: organizationId, conversation_id: conversationId })
      .sort({ created_at: 1 });

    // Seed initial message if conversation exists but messages empty
    if (messages.length === 0) {
      const conv = await this.conversationModel.findOne({ _id: conversationId, organization_id: organizationId });
      if (conv) {
        const seeded = await this.messageModel.create({
          organization_id: organizationId,
          conversation_id: conv._id,
          channel: conv.channel,
          direction: 'inbound',
          type: 'text',
          content: conv.last_message_text || 'Hello, is this product in stock?',
        });
        return [this.mapMessageDocument(seeded)];
      }
    }

    return messages.map(this.mapMessageDocument);
  }

  async sendMessage(
    organizationId: string,
    conversationId: string,
    dto: SendMessageDto
  ): Promise<IInboxMessage> {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      organization_id: organizationId,
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    // 1. Dispatch outbound to carrier
    let extId = '';
    if (conversation.channel === 'whatsapp') {
      const res = await this.whatsAppGateway.sendMessage(conversation.external_sender_id, dto.content);
      extId = res.messageId;
    } else {
      const res = await this.messengerGateway.sendMessage(conversation.external_sender_id, dto.content);
      extId = res.messageId;
    }

    // 2. Persist message record
    const messageDoc = await this.messageModel.create({
      organization_id: organizationId,
      conversation_id: conversation._id,
      channel: conversation.channel,
      direction: 'outbound',
      type: dto.type || 'text',
      content: dto.content,
      media_url: dto.media_url || null,
      external_message_id: extId,
      is_ai_generated: false,
    });

    // 3. Update conversation last message
    conversation.last_message_text = dto.content;
    conversation.last_message_at = new Date();
    await conversation.save();

    return this.mapMessageDocument(messageDoc);
  }

  async approveAIMessage(organizationId: string, messageId: string): Promise<IInboxMessage> {
    const msg = await this.messageModel.findOne({ _id: messageId, organization_id: organizationId });
    if (!msg) throw new NotFoundException('Message not found');

    const conv = await this.conversationModel.findById(msg.conversation_id);
    if (!conv) throw new NotFoundException('Conversation not found');

    // Dispatch message to external user
    if (conv.channel === 'whatsapp') {
      await this.whatsAppGateway.sendMessage(conv.external_sender_id, msg.content);
    } else {
      await this.messengerGateway.sendMessage(conv.external_sender_id, msg.content);
    }

    msg.ai_approval_status = 'approved';
    await msg.save();

    conv.last_message_text = msg.content;
    conv.last_message_at = new Date();
    await conv.save();

    return this.mapMessageDocument(msg);
  }

  async createOrderFromChat(
    organizationId: string,
    conversationId: string,
    dto: QuickOrderFromChatDto
  ): Promise<IOrder> {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      organization_id: organizationId,
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    // 1. Find or create customer
    let customer = await this.customerModel.findOne({
      organization_id: organizationId,
      phone_number: dto.customer_phone,
    });

    if (!customer) {
      customer = await this.customerModel.create({
        organization_id: organizationId,
        name: dto.customer_name,
        phone_number: dto.customer_phone,
        total_orders: 1,
        completed_orders: 0,
        cancelled_orders: 0,
        returned_orders: 0,
        total_spent: 0,
        return_rate_percentage: 0,
        is_high_risk: false,
      });
    }

    const count = await this.orderModel.countDocuments({ organization_id: organizationId });
    const orderNumber = `ORD-${10000 + count + 1}`;

    const subtotal = dto.items.reduce((acc, it) => acc + it.unit_price * it.quantity, 0);
    const shipping = dto.shipping_charge ?? 60;
    const total = subtotal + shipping;

    const orderDoc = await this.orderModel.create({
      organization_id: organizationId,
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: 'cod',
      customer_id: customer._id,
      customer_name: dto.customer_name,
      customer_phone: dto.customer_phone,
      shipping_address: {
        address_line: dto.delivery_address,
        city: dto.city,
        zone: dto.zone || dto.city,
        area: dto.city,
        postal_code: '1000',
      },
      items: dto.items.map((it) => ({
        product_id: it.product_id,
        variant_id: it.variant_id || null,
        name: 'Chat Order Item',
        sku: `ITEM-${it.product_id.slice(-4)}`,
        quantity: it.quantity,
        unit_price: it.unit_price,
        total_price: it.unit_price * it.quantity,
      })),
      subtotal,
      shipping_charge: shipping,
      discount_amount: 0,
      total_amount: total,
      cod_amount: total,
      timeline: [
        {
          status: 'pending',
          note: `Created directly from ${conversation.channel.toUpperCase()} chat conversation`,
          created_at: new Date(),
        },
      ],
      notes: dto.notes ? [{ content: dto.notes, author_name: 'Chat Agent', created_at: new Date() }] : [],
    });

    // Send confirmation message to customer chat
    const confirmationText = `Thank you ${dto.customer_name}! Your Cash on Delivery order ${orderNumber} for ৳${total} has been confirmed. We will dispatch it shortly.`;
    await this.sendMessage(organizationId, conversationId, { content: confirmationText, type: 'order_card' });

    conversation.status = 'resolved';
    await conversation.save();

    return orderDoc.toObject() as any;
  }

  async handleInboundMessage(params: {
    organizationId: string;
    channel: 'whatsapp' | 'facebook_messenger';
    externalSenderId: string;
    customerName: string;
    content: string;
    mediaUrl?: string;
  }): Promise<void> {
    let conversation = await this.conversationModel.findOne({
      organization_id: params.organizationId,
      channel: params.channel,
      external_sender_id: params.externalSenderId,
    });

    if (!conversation) {
      conversation = await this.conversationModel.create({
        organization_id: params.organizationId,
        channel: params.channel,
        external_sender_id: params.externalSenderId,
        customer_name: params.customerName,
        customer_phone: params.channel === 'whatsapp' ? params.externalSenderId : null,
        status: 'open',
        last_message_text: params.content,
        last_message_at: new Date(),
        unread_count: 1,
        ai_mode: 'copilot',
      });
    } else {
      conversation.last_message_text = params.content;
      conversation.last_message_at = new Date();
      conversation.unread_count += 1;
      await conversation.save();
    }

    // Save Inbound Message
    await this.messageModel.create({
      organization_id: params.organizationId,
      conversation_id: conversation._id,
      channel: params.channel,
      direction: 'inbound',
      type: 'text',
      content: params.content,
      media_url: params.mediaUrl || null,
    });

    // Check AI Mode Auto response
    if (conversation.ai_mode === 'auto' || conversation.ai_mode === 'approval') {
      try {
        const aiRes = await this.aiRouterService.routeCompletion(params.organizationId, null, {
          feature: 'customer_support_copilot',
          prompt: `Customer message: "${params.content}". Generate a helpful, courteous customer support reply in Bangla or English as appropriate for an ecommerce store.`,
          routing_mode: 'free_only',
        });

        if (conversation.ai_mode === 'auto') {
          await this.sendMessage(params.organizationId, conversation._id.toString(), {
            content: aiRes.text,
          });
        } else {
          // Approval Mode: Save draft message for merchant approval
          await this.messageModel.create({
            organization_id: params.organizationId,
            conversation_id: conversation._id,
            channel: params.channel,
            direction: 'outbound',
            type: 'text',
            content: aiRes.text,
            is_ai_generated: true,
            ai_approval_status: 'pending',
          });
        }
      } catch (err: any) {
        this.logger.error(`AI Copilot auto-generation failed: ${err.message}`);
      }
    }
  }

  private async seedSampleConversations(organizationId: string): Promise<void> {
    const samples = [
      {
        channel: 'whatsapp' as const,
        external_sender_id: '8801712345678',
        customer_name: 'Mahmudul Hasan',
        customer_phone: '01712345678',
        status: 'open' as const,
        last_message_text: 'Apnader Panjabi ki delivery hobe Chittagong e? Cash on Delivery ache?',
        last_message_at: new Date(Date.now() - 1000 * 60 * 15),
        unread_count: 1,
        ai_mode: 'copilot' as const,
        tags: ['inquiry', 'cod'],
      },
      {
        channel: 'facebook_messenger' as const,
        external_sender_id: 'fb_user_887766',
        customer_name: 'Sabrina Sultana',
        customer_phone: '01812345678',
        status: 'pending' as const,
        last_message_text: 'Order ta confirm korte chai. Red color size M ache?',
        last_message_at: new Date(Date.now() - 1000 * 60 * 45),
        unread_count: 0,
        ai_mode: 'approval' as const,
        tags: ['ready-to-buy'],
      },
    ];

    for (const s of samples) {
      const conv = await this.conversationModel.create({
        organization_id: organizationId,
        ...s,
      });

      await this.messageModel.create({
        organization_id: organizationId,
        conversation_id: conv._id,
        channel: s.channel,
        direction: 'inbound',
        type: 'text',
        content: s.last_message_text,
      });
    }
  }

  private mapConversationDocument(doc: InboxConversationDocument): IInboxConversation {
    return {
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      channel: doc.channel,
      external_sender_id: doc.external_sender_id,
      customer_name: doc.customer_name,
      customer_phone: doc.customer_phone,
      customer_id: doc.customer_id ? doc.customer_id.toString() : null,
      status: doc.status,
      assigned_user_id: doc.assigned_user_id ? doc.assigned_user_id.toString() : null,
      last_message_text: doc.last_message_text,
      last_message_at: (doc as any).last_message_at.toISOString(),
      unread_count: doc.unread_count,
      ai_mode: doc.ai_mode,
      tags: doc.tags || [],
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    };
  }

  private mapMessageDocument(doc: InboxMessageDocument): IInboxMessage {
    return {
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      conversation_id: doc.conversation_id.toString(),
      channel: doc.channel,
      direction: doc.direction,
      type: doc.type,
      content: doc.content,
      media_url: doc.media_url,
      external_message_id: doc.external_message_id,
      is_ai_generated: doc.is_ai_generated,
      ai_approval_status: doc.ai_approval_status as any,
      created_at: (doc as any).created_at.toISOString(),
    };
  }
}
