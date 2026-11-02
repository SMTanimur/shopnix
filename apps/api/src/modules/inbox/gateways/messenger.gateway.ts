import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessengerGateway {
  private readonly logger = new Logger(MessengerGateway.name);

  constructor(private readonly configService: ConfigService) {}

  async sendMessage(recipientId: string, text: string): Promise<{ success: boolean; messageId: string }> {
    const token = this.configService.get<string>('FACEBOOK_PAGE_ACCESS_TOKEN');

    if (!token) {
      this.logger.log(`[Messenger Sandbox] Message dispatched to recipient ${recipientId}: "${text}"`);
      return { success: true, messageId: `mock_fb_${Date.now()}` };
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Messenger Send API error: ${err}`);
      }

      const json = await res.json();
      return { success: true, messageId: json.message_id || `fb_${Date.now()}` };
    } catch (err: any) {
      this.logger.error(`Messenger send failed: ${err.message}`);
      return { success: false, messageId: `err_${Date.now()}` };
    }
  }
}
