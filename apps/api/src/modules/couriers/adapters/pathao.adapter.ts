import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type {
  ICourierProvider,
  CourierProviderName,
  ConsignmentRequest,
  ConsignmentResponse,
  TrackingResponse,
} from '@shopnix/types';

@Injectable()
export class PathaoCourierAdapter implements ICourierProvider {
  public readonly providerName: CourierProviderName = 'pathao';
  private readonly logger = new Logger(PathaoCourierAdapter.name);

  constructor(
    private readonly clientId: string = '',
    private readonly clientSecret: string = '',
    private readonly username: string = '',
    private readonly password: string = '',
    private readonly baseURL: string = 'https://api-hermes.pathao.com'
  ) {}

  private async getAccessToken(): Promise<string> {
    const response = await axios.post(`${this.baseURL}/aladdin/api/v1/issue-token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: this.username,
      password: this.password,
      grant_type: 'password',
    });
    return response.data.access_token;
  }

  async createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse> {
    try {
      const token = await this.getAccessToken();

      const payload = {
        store_id: 1, // Default store ID
        merchant_order_id: request.invoice_number,
        recipient_name: request.recipient_name,
        recipient_phone: request.recipient_phone,
        recipient_address: request.recipient_address,
        recipient_city: 1, // Default Dhaka city ID
        recipient_zone: 1,
        delivery_type: 48, // Standard 48-hour delivery
        item_type: 2, // Parcel
        special_instruction: request.special_instruction || '',
        item_quantity: 1,
        item_weight: request.item_weight || 0.5,
        amount_to_collect: request.cod_amount,
        item_description: request.item_description || 'Retail products',
      };

      const response = await axios.post(`${this.baseURL}/aladdin/api/v1/orders`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data.data;
      return {
        success: true,
        consignment_id: data.consignment_id,
        tracking_code: data.consignment_id,
        courier_status: data.order_status || 'Pending',
        delivery_charge: data.delivery_fee,
        raw_response: data,
      };
    } catch (error) {
      this.logger.error(`Pathao order creation error: ${(error as Error).message}`);
      throw error;
    }
  }

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/aladdin/api/v1/shipments/${trackingCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data;
      return {
        consignment_id: trackingCode,
        tracking_code: trackingCode,
        status: data.order_status || 'Unknown',
      };
    } catch (error) {
      this.logger.error(`Pathao tracking error: ${(error as Error).message}`);
      throw error;
    }
  }

  async cancelShipment(): Promise<boolean> {
    return false;
  }

  async getDeliveryCharge(weight: number, city: string): Promise<number> {
    const isDhaka = city.toLowerCase().includes('dhaka');
    const base = isDhaka ? 60 : 120;
    return weight > 0.5 ? base + Math.ceil((weight - 0.5) * 2) * 20 : base;
  }
}
