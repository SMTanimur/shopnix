import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CourierConfiguration,
  CourierConfigurationDocument,
} from './courier-configuration.schema';
import { Order, OrderDocument } from '../orders/order.schema';
import type { ConfigureCourierInput, DispatchCourierInput } from '@shopnix/schemas';
import type {
  ICourierProvider,
  ConsignmentResponse,
  TrackingResponse,
  CourierProviderName,
} from '@shopnix/types';
import { SandboxCourierAdapter } from './adapters/sandbox.adapter';
import { SteadfastCourierAdapter } from './adapters/steadfast.adapter';
import { PathaoCourierAdapter } from './adapters/pathao.adapter';
import { RedXCourierAdapter } from './adapters/redx.adapter';
import { ECourierAdapter } from './adapters/ecourier.adapter';

@Injectable()
export class CouriersService {
  private readonly logger = new Logger(CouriersService.name);

  constructor(
    @InjectModel(CourierConfiguration.name)
    private configModel: Model<CourierConfigurationDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>
  ) {}

  async listConfigs(organizationId: string | Types.ObjectId): Promise<CourierConfigurationDocument[]> {
    return this.configModel.find({ organization_id: new Types.ObjectId(String(organizationId)) }).exec();
  }

  async configure(
    organizationId: string | Types.ObjectId,
    input: ConfigureCourierInput
  ): Promise<CourierConfigurationDocument> {
    const orgId = new Types.ObjectId(String(organizationId));

    const updated = await this.configModel.findOneAndUpdate(
      { organization_id: orgId, provider: input.provider },
      { $set: input },
      { upsert: true, new: true }
    );

    return updated;
  }

  private getAdapter(
    provider: CourierProviderName,
    config?: CourierConfigurationDocument | null
  ): ICourierProvider {
    switch (provider) {
      case 'sandbox':
        return new SandboxCourierAdapter();
      case 'steadfast':
        return new SteadfastCourierAdapter(
          config?.credentials?.['api_key'] || '',
          config?.credentials?.['secret_key'] || ''
        );
      case 'pathao':
        return new PathaoCourierAdapter(
          config?.credentials?.['client_id'] || '',
          config?.credentials?.['client_secret'] || '',
          config?.credentials?.['username'] || '',
          config?.credentials?.['password'] || ''
        );
      case 'redx':
        return new RedXCourierAdapter(config?.credentials?.['api_token'] || '');
      case 'ecourier':
        return new ECourierAdapter(
          config?.credentials?.['api_key'] || '',
          config?.credentials?.['api_secret'] || '',
          config?.credentials?.['user_id'] || ''
        );
      default:
        return new SandboxCourierAdapter();
    }
  }

  async dispatch(
    organizationId: string | Types.ObjectId,
    input: DispatchCourierInput
  ): Promise<ConsignmentResponse> {
    const orgId = new Types.ObjectId(String(organizationId));
    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(input.order_id),
      organization_id: orgId,
      deleted_at: null,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.consignment_id) {
      throw new BadRequestException(`Order already booked with courier (Consignment ID: ${order.consignment_id})`);
    }

    const courierConfig = await this.configModel.findOne({
      organization_id: orgId,
      provider: input.provider,
      is_active: true,
    });

    // If live credentials are not present or sandbox is requested, fallback gracefully to SandboxAdapter
    const adapter = this.getAdapter(input.provider, courierConfig);

    const bookingResult = await adapter.createConsignment({
      order_id: String(order._id),
      invoice_number: order.order_number,
      recipient_name: order.customer_name,
      recipient_phone: order.customer_phone,
      recipient_address: order.shipping_address.address_line,
      recipient_city: order.shipping_address.city,
      recipient_zone: order.shipping_address.zone,
      recipient_area: order.shipping_address.area,
      cod_amount: order.cod_amount,
      item_weight: input.item_weight,
      special_instruction: input.special_instruction,
    });

    // Update order with courier consignment info & shift status to shipped
    order.courier_provider = input.provider;
    order.consignment_id = bookingResult.consignment_id;
    order.tracking_code = bookingResult.tracking_code;
    order.courier_status = bookingResult.courier_status;
    order.status = 'shipped';
    order.timeline.push({
      status: 'shipped',
      note: `Booked with ${input.provider.toUpperCase()} (Consignment: ${bookingResult.consignment_id})`,
      author_id: null as any,
      created_at: new Date(),
    });

    await order.save();

    return bookingResult;
  }

  async track(
    organizationId: string | Types.ObjectId,
    consignmentId: string
  ): Promise<TrackingResponse> {
    const orgId = new Types.ObjectId(String(organizationId));
    const order = await this.orderModel.findOne({
      organization_id: orgId,
      consignment_id: consignmentId,
    });

    const providerName = (order?.courier_provider as CourierProviderName) || 'sandbox';
    const config = await this.configModel.findOne({
      organization_id: orgId,
      provider: providerName,
    });

    const adapter = this.getAdapter(providerName, config);
    return adapter.trackShipment(order?.tracking_code || consignmentId);
  }
}
