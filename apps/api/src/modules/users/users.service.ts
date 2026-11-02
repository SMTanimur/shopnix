import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string, includePassword = false): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password_hash');
    }
    return query.exec();
  }

  async findByOrganization(organizationId: string | Types.ObjectId): Promise<UserDocument[]> {
    return this.userModel.find({ organization_id: organizationId, deleted_at: null }).exec();
  }

  async updateLastLogin(id: string | Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { last_login_at: new Date() }).exec();
  }
}
