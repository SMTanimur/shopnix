import { Injectable, Logger } from '@nestjs/common';
import type {
  ICourierProvider,
  CourierProviderName,
  ConsignmentRequest,
  ConsignmentResponse,
  TrackingResponse,
} from '@shopnix/types';

@Injectable()
export class SandboxCourierAdapter implements ICourierProvider {
  public readonly providerName: CourierProviderName = 'sandbox';
  private readonly logger = new Logger(SandboxCourierAdapter.name);

  async createConsignment(request: ConsignmentRequest): Promise<ConsignmentResponse> {
    this.logger.log(`[SandboxCourier] Simulated booking for invoice ${request.invoice_number}`);
    const simulatedConsignmentId = `SBX-CN-${Date.now()}`;
    const simulatedTrackingCode = `SBX-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      success: true,
      consignment_id: simulatedConsignmentId,
      tracking_code: simulatedTrackingCode,
      courier_status: 'in_review',
      delivery_charge: 70, // Standard Dhaka delivery charge in BDT
      raw_response: {
        provider: 'sandbox',
        simulated: true,
        created_at: new Date().toISOString(),
      },
    };
  }

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    return {
      consignment_id: `CN-${trackingCode}`,
      tracking_code: trackingCode,
      status: 'in_transit',
      current_location: 'Dhaka Central Hub',
      timeline: [
        {
          status: 'parcel_picked_up',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          note: 'Parcel collected from merchant warehouse',
        },
        {
          status: 'in_transit',
          timestamp: new Date().toISOString(),
          note: 'Sorted at Dhaka Central Hub',
        },
      ],
    };
  }

  async cancelShipment(consignmentId: string): Promise<boolean> {
    this.logger.log(`[SandboxCourier] Simulated cancellation of consignment ${consignmentId}`);
    return true;
  }

  async getDeliveryCharge(weight: number, city: string): Promise<number> {
    const isDhaka = city.toLowerCase().includes('dhaka');
    const baseCharge = isDhaka ? 70 : 130;
    const additionalWeightCharge = weight > 1 ? (weight - 1) * 20 : 0;
    return baseCharge + additionalWeightCharge;
  }
}
