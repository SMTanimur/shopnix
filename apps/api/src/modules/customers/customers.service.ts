import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import type { CreateCustomerInput, UpdateCustomerInput } from '@shopnix/schemas';
import type { CustomerFilterParams, PaginationMeta } from '@shopnix/types';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>
  ) {}

  async list(
    organizationId: string | Types.ObjectId,
    params: CustomerFilterParams = {}
  ): Promise<{ items: CustomerDocument[]; meta: PaginationMeta }> {
    const {
      page = 1,
      limit = 20,
      search,
      is_high_risk,
      sort_by = 'total_spent',
      sort_order = 'desc',
    } = params;

    const query: Record<string, unknown> = {
      organization_id: new Types.ObjectId(String(organizationId)),
      deleted_at: null,
    };

    if (is_high_risk !== undefined) {
      query.is_high_risk = is_high_risk;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone_number: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sort_by]: sort_order === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      this.customerModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.customerModel.countDocuments(query).exec(),
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
  ): Promise<CustomerDocument> {
    const customer = await this.customerModel
      .findOne({
        _id: new Types.ObjectId(id),
        organization_id: new Types.ObjectId(String(organizationId)),
        deleted_at: null,
      })
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async create(
    organizationId: string | Types.ObjectId,
    input: CreateCustomerInput
  ): Promise<CustomerDocument> {
    const created = new this.customerModel({
      ...input,
      organization_id: new Types.ObjectId(String(organizationId)),
    });
    return created.save();
  }

  async update(
    organizationId: string | Types.ObjectId,
    id: string,
    input: UpdateCustomerInput
  ): Promise<CustomerDocument> {
    const updated = await this.customerModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          organization_id: new Types.ObjectId(String(organizationId)),
          deleted_at: null,
        },
        { $set: input },
        { new: true }
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Customer not found');
    }
    return updated;
  }
}
