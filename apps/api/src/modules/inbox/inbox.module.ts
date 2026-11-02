import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InboxConversation, InboxConversationSchema } from './schemas/inbox-conversation.schema';
import { InboxMessage, InboxMessageSchema } from './schemas/inbox-message.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { WhatsAppGateway } from './gateways/whatsapp.gateway';
import { MessengerGateway } from './gateways/messenger.gateway';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InboxConversation.name, schema: InboxConversationSchema },
      { name: InboxMessage.name, schema: InboxMessageSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    AIModule,
  ],
  controllers: [InboxController],
  providers: [WhatsAppGateway, MessengerGateway, InboxService],
  exports: [InboxService],
})
export class InboxModule {}
