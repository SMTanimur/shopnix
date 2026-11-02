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
export class RedXCourierAdapter implements ICourierProvider {
  public readonly providerName: CourierProviderName = 'redx';
  private readonly logger = new Logger(RedXCourierAdapter.name);

  constructor(
    private readonly apiToken: string = '',
    private readonly baseURL: string = 'https://openapi.redx.com.bd/v1.0.0-beta'
  ) {}

  private getHeaders() {
    return {
      'API-ACCESS-TOKEN': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse> {
    try {
      const payload = {
        customer_name: request.recipient_name,
        customer_phone: request.recipient_phone,
        delivery_area: request.recipient_city || 'Dhaka',
        delivery_area_id: 1,
        customer_address: request.recipient_address,
        merchant_invoice_id: request.invoice_number,
        cash_collection_amount: request.cod_amount,
        parcel_weight: (request.item_weight || 0.5) * 1000, // RedX takes weight in grams
        instruction: request.special_instruction || '',
      };

      const response = await axios.post(`${this.baseURL}/parcel`, payload, {
        headers: this.getHeaders(),
      });

      const trackingId = response.data.tracking_id;
      return {
        success: true,
        consignment_id: String(trackingId),
        tracking_code: String(trackingId),
        courier_status: 'ready_for_pickup',
        raw_response: response.data,
      };
    } catch (error) {
      this.logger.error(`RedX booking error: ${(error as Error).message}`);
      throw error;
    }
  }

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/parcel/track/${trackingCode}`, {
        headers: this.getHeaders(),
      });

      const tracking = response.data.tracking;
      return {
        consignment_id: trackingCode,
        tracking_code: trackingCode,
        status: tracking.status || 'unknown',
      };
    } catch (error) {
      this.logger.error(`RedX track error: ${(error as Error).message}`);
      throw error;
    }
  }

  async cancelShipment(): Promise<boolean> {
    return false;
  }

  async getDeliveryCharge(weight: number, city: string): Promise<number> {
    const isDhaka = city.toLowerCase().includes('dhaka');
    return isDhaka ? 70 : 130;
  }
}
