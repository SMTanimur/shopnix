import { Injectable, Logger } from '@nestjs/common';
import type {
  ICourierProvider,
  CourierProviderName,
  ConsignmentRequest,
  ConsignmentResponse,
  TrackingResponse,
} from '@shopnix/types';

@Injectable()
export class CarrybeeCourierAdapter implements ICourierProvider {
  public readonly providerName: CourierProviderName = 'carrybee';
  private readonly logger = new Logger(CarrybeeCourierAdapter.name);

  constructor(private readonly apiKey: string = '') {}

  async createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse> {
    const code = `CB-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      consignment_id: code,
      tracking_code: code,
      courier_status: 'pickup_scheduled',
      delivery_charge: request.recipient_city?.toLowerCase().includes('dhaka') ? 55 : 110,
    };
  }

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    return {
      consignment_id: trackingCode,
      tracking_code: trackingCode,
      status: 'out_for_delivery',
      current_location: 'Uttara Hub — Carrybee Express',
      timeline: [
        { status: 'Order Booked', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'Consignment registered' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Rider assigned for doorstep COD delivery' },
      ],
    };
  }

  async cancelShipment(): Promise<boolean> {
    return true;
  }

  async getDeliveryCharge(weight: number, city: string): Promise<number> {
    const isDhaka = city.toLowerCase().includes('dhaka');
    return isDhaka ? 55 : 110;
  }
}
