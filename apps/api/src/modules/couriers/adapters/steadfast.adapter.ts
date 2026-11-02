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
export class SteadfastCourierAdapter implements ICourierProvider {
  public readonly providerName: CourierProviderName = 'steadfast';
  private readonly logger = new Logger(SteadfastCourierAdapter.name);

  constructor(
    private readonly apiKey: string = '',
    private readonly secretKey: string = '',
    private readonly baseURL: string = 'https://portal.steadfast.com.bd/api/v1'
  ) {}

  private getHeaders() {
    return {
      'Api-Key': this.apiKey,
      'Secret-Key': this.secretKey,
      'Content-Type': 'application/json',
    };
  }

  async createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse> {
    try {
      if (!this.apiKey || !this.secretKey) {
        throw new Error('Steadfast API credentials are not configured');
      }

      const payload = {
        invoice: request.invoice_number,
        recipient_name: request.recipient_name,
        recipient_phone: request.recipient_phone,
        recipient_address: request.recipient_address,
        cod_amount: request.cod_amount,
        note: request.special_instruction || '',
      };

      const response = await axios.post(`${this.baseURL}/create_order`, payload, {
        headers: this.getHeaders(),
        timeout: 15000,
      });

      const data = response.data;
      if (data.status === 200 && data.consignment) {
        return {
          success: true,
          consignment_id: String(data.consignment.consignment_id),
          tracking_code: data.consignment.tracking_code,
          courier_status: data.consignment.status || 'in_review',
          delivery_charge: data.consignment.delivery_fee,
          raw_response: data,
        };
      }

      throw new Error(data.message || 'Steadfast order creation failed');
    } catch (error) {
      this.logger.error(`Steadfast creation error: ${(error as Error).message}`);
      throw error;
    }
  }

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}/status_by_trackingcode/${trackingCode}`,
        {
          headers: this.getHeaders(),
          timeout: 10000,
        }
      );

      const data = response.data;
      return {
        consignment_id: '',
        tracking_code: trackingCode,
        status: data.delivery_status || 'unknown',
        timeline: [],
      };
    } catch (error) {
      this.logger.error(`Steadfast tracking error: ${(error as Error).message}`);
      throw error;
    }
  }

  async cancelShipment(): Promise<boolean> {
    // Steadfast does not provide a public cancellation endpoint; orders must be cancelled via portal
    return false;
  }

  async getDeliveryCharge(weight: number, city: string): Promise<number> {
    const isDhaka = city.toLowerCase().includes('dhaka');
    const base = isDhaka ? 70 : 130;
    return weight > 1 ? base + (weight - 1) * 20 : base;
  }
}
