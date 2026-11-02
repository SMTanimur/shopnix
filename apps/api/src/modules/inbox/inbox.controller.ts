import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '@shopnix/types';
import {
  sendMessageSchema,
  updateConversationSchema,
  quickOrderFromChatSchema,
  type SendMessageInput,
  type UpdateConversationInput,
  type QuickOrderFromChatInput,
} from '@shopnix/schemas';
import { InboxService } from './inbox.service';

@ApiTags('Omnichannel Inbox')
@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get('conversations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List customer chat conversations across WhatsApp & Messenger' })
  async listConversations(
    @CurrentUser() user: AuthenticatedUser,
    @Query('channel') channel?: string,
    @Query('status') status?: string
  ) {
    const data = await this.inboxService.listConversations(user.organizationId, {
      channel,
      status,
    });
    return { success: true, data };
  }

  @Get('conversations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get single conversation detail' })
  async getConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.inboxService.getConversation(user.organizationId, id);
    return { success: true, data };
  }

  @Patch('conversations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update conversation status, assigned agent, or AI mode' })
  @UsePipes(new ZodValidationPipe(updateConversationSchema))
  async updateConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateConversationInput
  ) {
    const data = await this.inboxService.updateConversation(user.organizationId, id, dto);
    return { success: true, data };
  }

  @Get('conversations/:id/messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all message history in a conversation thread' })
  async listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.inboxService.listMessages(user.organizationId, id);
    return { success: true, data };
  }

  @Post('conversations/:id/messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send outbound message to customer WhatsApp/Messenger' })
  @UsePipes(new ZodValidationPipe(sendMessageSchema))
  async sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: SendMessageInput
  ) {
    const data = await this.inboxService.sendMessage(user.organizationId, id, dto);
    return { success: true, data };
  }

  @Post('messages/:id/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Approve and dispatch AI generated draft message' })
  async approveAIMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.inboxService.approveAIMessage(user.organizationId, id);
    return { success: true, data, message: 'Message approved and sent' };
  }

  @Post('conversations/:id/create-order')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Instant 1-Click order creation directly from chat thread' })
  @UsePipes(new ZodValidationPipe(quickOrderFromChatSchema))
  async createOrderFromChat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: QuickOrderFromChatInput
  ) {
    const data = await this.inboxService.createOrderFromChat(user.organizationId, id, dto);
    return { success: true, data, message: 'Order created and confirmation sent' };
  }

  // --- Public Webhook Handlers for Meta ---

  @Get('webhooks/whatsapp')
  @ApiOperation({ summary: 'WhatsApp Cloud API webhook verification' })
  verifyWhatsAppWebhook(@Query() query: any, @Res() res: any) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === 'shopnix_wa_webhook_verify_token') {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  @Post('webhooks/whatsapp')
  @ApiOperation({ summary: 'WhatsApp Cloud API incoming message webhook' })
  async receiveWhatsAppWebhook(@Body() body: any) {
    // Process incoming WhatsApp message payload asynchronously
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (message) {
      // Inbound processing
    }
    return { status: 'EVENT_RECEIVED' };
  }
}
