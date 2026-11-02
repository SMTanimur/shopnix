import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './organization.schema';
import type { UpdateOrganizationInput } from '@shopnix/schemas';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private orgModel: Model<OrganizationDocument>
  ) {}

  async findById(id: string | Types.ObjectId): Promise<OrganizationDocument> {
    const org = await this.orgModel.findById(id).exec();
    if (!org || org.deleted_at) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async findBySlug(slug: string): Promise<OrganizationDocument | null> {
    return this.orgModel.findOne({ slug: slug.toLowerCase(), deleted_at: null }).exec();
  }

  async update(id: string | Types.ObjectId, input: UpdateOrganizationInput): Promise<OrganizationDocument> {
    const org = await this.orgModel
      .findByIdAndUpdate(id, { $set: input }, { new: true })
      .exec();

    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }
}
