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
export class ECourierAdapter implements ICourierProvider {
  public readonly providerName: CourierProviderName = 'ecourier';
  private readonly logger = new Logger(ECourierAdapter.name);

  constructor(
    private readonly apiKey: string = '',
    private readonly apiSecret: string = '',
    private readonly userId: string = '',
    private readonly baseURL: string = 'https://backoffice.ecourier.com.bd/api'
  ) {}

  private getHeaders() {
    return {
      'API-KEY': this.apiKey,
      'API-SECRET': this.apiSecret,
      'USER-ID': this.userId,
      'Content-Type': 'application/json',
    };
  }

  async createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse> {
    try {
      const payload = {
        recipient_name: request.recipient_name,
        recipient_mobile: request.recipient_phone,
        recipient_city: request.recipient_city || 'Dhaka',
        recipient_thana: 'Gulshan',
        recipient_area: request.recipient_area || 'Dhaka',
        recipient_address: request.recipient_address,
        package_code: '#1',
        product_price: request.cod_amount,
        payment_method: 'COD',
      };

      const response = await axios.post(`${this.baseURL}/order-place`, payload, {
        headers: this.getHeaders(),
      });

      const trackingId = response.data.ID || response.data.tracking_id;
      return {
        success: true,
        consignment_id: String(trackingId),
        tracking_code: String(trackingId),
        courier_status: 'Placed',
        raw_response: response.data,
      };
    } catch (error) {
      this.logger.error(`eCourier booking error: ${(error as Error).message}`);
      throw error;
    }
  }

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/track`,
        { ecr_id: trackingCode },
        { headers: this.getHeaders() }
      );

      return {
        consignment_id: trackingCode,
        tracking_code: trackingCode,
        status: response.data.status || 'unknown',
      };
    } catch (error) {
      this.logger.error(`eCourier track error: ${(error as Error).message}`);
      throw error;
    }
  }

  async cancelShipment(): Promise<boolean> {
    return false;
  }

  async getDeliveryCharge(weight: number, city: string): Promise<number> {
    const isDhaka = city.toLowerCase().includes('dhaka');
    return isDhaka ? 80 : 140;
  }
}
