import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsAppGateway {
  private readonly logger = new Logger(WhatsAppGateway.name);

  constructor(private readonly configService: ConfigService) {}

  async sendMessage(to: string, text: string): Promise<{ success: boolean; messageId: string }> {
    const token = this.configService.get<string>('WHATSAPP_CLOUD_TOKEN');
    const phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');

    if (!token || !phoneNumberId) {
      this.logger.log(`[WhatsApp Sandbox] Message dispatched to ${to}: "${text}"`);
      return { success: true, messageId: `mock_wa_${Date.now()}` };
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`WhatsApp Send API error (${res.status}): ${err}`);
      }

      const json = await res.json();
      return { success: true, messageId: json.messages?.[0]?.id || `wa_${Date.now()}` };
    } catch (err: any) {
      this.logger.error(`WhatsApp send failed: ${err.message}`);
      return { success: false, messageId: `err_${Date.now()}` };
    }
  }
}
