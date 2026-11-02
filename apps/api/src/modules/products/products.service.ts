import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { ProductVariant, ProductVariantDocument } from './product-variant.schema';
import type { CreateProductInput, UpdateProductInput } from '@shopnix/schemas';
import type { ProductFilterParams, PaginationMeta } from '@shopnix/types';
import { generateSlug } from '@shopnix/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductVariant.name) private variantModel: Model<ProductVariantDocument>
  ) {}

  async list(
    organizationId: string | Types.ObjectId,
    params: ProductFilterParams = {}
  ): Promise<{ items: ProductDocument[]; meta: PaginationMeta }> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      category_id,
      low_stock,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = params;

    const query: Record<string, unknown> = {
      organization_id: new Types.ObjectId(String(organizationId)),
      deleted_at: null,
    };

    if (status) {
      query.status = status;
    }

    if (category_id) {
      query.category_ids = new Types.ObjectId(category_id);
    }

    if (low_stock) {
      query.$expr = { $lte: ['$stock_quantity', '$low_stock_threshold'] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sort_by]: sort_order === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      this.productModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(query).exec(),
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
  ): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({
        _id: new Types.ObjectId(id),
        organization_id: new Types.ObjectId(String(organizationId)),
        deleted_at: null,
      })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(
    organizationId: string | Types.ObjectId,
    input: CreateProductInput
  ): Promise<ProductDocument> {
    const orgId = new Types.ObjectId(String(organizationId));

    const existingSku = await this.productModel.findOne({
      organization_id: orgId,
      sku: input.sku.toUpperCase(),
      deleted_at: null,
    });

    if (existingSku) {
      throw new ConflictException(`SKU "${input.sku}" already exists in your store`);
    }

    const baseSlug = generateSlug(input.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await this.productModel.findOne({ organization_id: orgId, slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const createdProduct = new this.productModel({
      ...input,
      organization_id: orgId,
      sku: input.sku.toUpperCase(),
      slug: uniqueSlug,
      category_ids: input.category_ids.map((id) => new Types.ObjectId(id)),
    });

    return createdProduct.save();
  }

  async update(
    organizationId: string | Types.ObjectId,
    id: string,
    input: UpdateProductInput
  ): Promise<ProductDocument> {
    const orgId = new Types.ObjectId(String(organizationId));
    const prodId = new Types.ObjectId(id);

    if (input.sku) {
      const existingSku = await this.productModel.findOne({
        _id: { $ne: prodId },
        organization_id: orgId,
        sku: input.sku.toUpperCase(),
        deleted_at: null,
      });

      if (existingSku) {
        throw new ConflictException(`SKU "${input.sku}" is already in use by another product`);
      }
    }

    const updated = await this.productModel
      .findOneAndUpdate(
        { _id: prodId, organization_id: orgId, deleted_at: null },
        { $set: input },
        { new: true }
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async softDelete(
    organizationId: string | Types.ObjectId,
    id: string
  ): Promise<void> {
    const updated = await this.productModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          organization_id: new Types.ObjectId(String(organizationId)),
          deleted_at: null,
        },
        { $set: { deleted_at: new Date(), status: 'archived' } }
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Product not found');
    }
  }

  async duplicate(
    organizationId: string | Types.ObjectId,
    id: string
  ): Promise<ProductDocument> {
    const product = await this.findById(organizationId, id);

    const baseSku = `${product.sku}-COPY`;
    let uniqueSku = baseSku;
    let counter = 1;
    while (
      await this.productModel.findOne({
        organization_id: product.organization_id,
        sku: uniqueSku,
      })
    ) {
      uniqueSku = `${baseSku}-${counter++}`;
    }

    const duplicated = new this.productModel({
      ...product.toObject(),
      _id: new Types.ObjectId(),
      name: `${product.name} (Copy)`,
      sku: uniqueSku,
      slug: generateSlug(`${product.name}-copy-${Date.now()}`),
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    });

    return duplicated.save();
  }
}
