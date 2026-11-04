import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { Customer, CustomerDocument } from '../customers/customer.schema';
import type { CreateOrderInput, UpdateOrderStatusInput } from '@shopnix/schemas';
import type { OrderFilterParams, PaginationMeta, OrderStatus } from '@shopnix/types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>
  ) {}

  async list(
    organizationId: string | Types.ObjectId,
    params: OrderFilterParams = {}
  ): Promise<{ items: OrderDocument[]; meta: PaginationMeta }> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      payment_status,
      courier_provider,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = params;

    const query: Record<string, unknown> = {
      organization_id: new Types.ObjectId(String(organizationId)),
      deleted_at: null,
    };

    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;
    if (courier_provider) query.courier_provider = courier_provider;

    if (search) {
      query.$or = [
        { order_number: { $regex: search, $options: 'i' } },
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_phone: { $regex: search, $options: 'i' } },
        { consignment_id: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sort_by]: sort_order === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      this.orderModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(query).exec(),
    ]);

    const total_pages = Math.ceil(total / limit) || 1;

    return {
      items,
      meta: {
        page,
        limit,
        total,
        total_pages,
        has_next_page: page < total_pages,
        has_prev_page: page > 1,
      },
    };
  }

  async findById(
    organizationId: string | Types.ObjectId,
    id: string
  ): Promise<OrderDocument> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel
      .findOne({
        _id: new Types.ObjectId(id),
        organization_id: new Types.ObjectId(String(organizationId)),
        deleted_at: null,
      })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async create(
    organizationId: string | Types.ObjectId,
    input: CreateOrderInput,
    authorId?: string | Types.ObjectId
  ): Promise<OrderDocument> {
    const orgId = new Types.ObjectId(String(organizationId));

    // 1. Find or create customer by phone number
    let customer = await this.customerModel.findOne({
      organization_id: orgId,
      phone_number: input.customer_phone,
    });

    if (!customer) {
      customer = new this.customerModel({
        organization_id: orgId,
        name: input.customer_name,
        phone_number: input.customer_phone,
        email: input.customer_email || null,
        addresses: [
          {
            ...input.shipping_address,
            label: 'Default',
            is_default: true,
          },
        ],
      });
      await customer.save();
    }

    // 2. Generate incremental Order Number: ORD-10001
    const count = await this.orderModel.countDocuments({ organization_id: orgId });
    const orderNumber = `ORD-${10001 + count}`;

    // 3. Calculate Financial Totals
    const subtotal = input.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const totalAmount = subtotal + input.shipping_charge - input.discount_amount;
    const codAmount = input.payment_method === 'cod' ? totalAmount : 0;

    const initialTimelineEvent = {
      status: 'pending',
      note: 'Order created',
      author_id: authorId ? new Types.ObjectId(String(authorId)) : null,
      created_at: new Date(),
    };

    const createdOrder = new this.orderModel({
      organization_id: orgId,
      order_number: orderNumber,
      status: 'pending',
      payment_status: input.payment_method === 'cod' ? 'unpaid' : 'paid',
      payment_method: input.payment_method,
      customer_id: customer._id,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_email: input.customer_email || null,
      shipping_address: input.shipping_address,
      items: input.items.map((item) => ({
        ...item,
        product_id: new Types.ObjectId(item.product_id),
        variant_id: item.variant_id ? new Types.ObjectId(item.variant_id) : null,
      })),
      subtotal,
      shipping_charge: input.shipping_charge,
      discount_amount: input.discount_amount,
      total_amount: totalAmount,
      cod_amount: codAmount,
      timeline: [initialTimelineEvent],
      notes: input.notes
        ? [
            {
              content: input.notes,
              author_id: authorId ? new Types.ObjectId(String(authorId)) : null,
              author_name: 'System',
              created_at: new Date(),
            },
          ]
        : [],
    });

    const saved = await createdOrder.save();

    // Increment customer stats
    await this.customerModel.findByIdAndUpdate(customer._id, {
      $inc: { total_orders: 1, total_spent: totalAmount },
    });

    return saved;
  }

  async updateStatus(
    organizationId: string | Types.ObjectId,
    id: string,
    input: UpdateOrderStatusInput,
    authorId?: string | Types.ObjectId
  ): Promise<OrderDocument> {
    const order = await this.findById(organizationId, id);

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned'],
      cancelled: [],
      returned: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(input.status as OrderStatus)) {
      throw new BadRequestException(
        `Cannot transition order status from "${order.status}" to "${input.status}"`
      );
    }

    const timelineEvent = {
      status: input.status,
      note: input.note || `Status shifted to ${input.status}`,
      author_id: authorId ? new Types.ObjectId(String(authorId)) : null,
      created_at: new Date(),
    };

    order.status = input.status as OrderStatus;
    order.timeline.push(timelineEvent as any);

    if (input.status === 'delivered') {
      order.payment_status = 'paid';
      await this.customerModel.findByIdAndUpdate(order.customer_id, {
        $inc: { completed_orders: 1 },
      });
    } else if (input.status === 'cancelled') {
      await this.customerModel.findByIdAndUpdate(order.customer_id, {
        $inc: { cancelled_orders: 1 },
      });
    } else if (input.status === 'returned') {
      await this.customerModel.findByIdAndUpdate(order.customer_id, {
        $inc: { returned_orders: 1 },
      });
    }

    return order.save();
  }

  async addNote(
    organizationId: string | Types.ObjectId,
    id: string,
    content: string,
    authorId: string | Types.ObjectId,
    authorName: string
  ): Promise<OrderDocument> {
    const order = await this.findById(organizationId, id);

    order.notes.push({
      content,
      author_id: new Types.ObjectId(String(authorId)) as any,
      author_name: authorName,
      created_at: new Date(),
    });

    return order.save();
  }
}
