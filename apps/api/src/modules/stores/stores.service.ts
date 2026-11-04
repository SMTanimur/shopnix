import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type {
  StoreIntegration as IStoreIntegration,
  StoreSyncLog as IStoreSyncLog,
  ConnectStoreDto,
  UpdateStoreDto,
  TriggerStoreSyncDto,
  OrderStatus,
} from '@shopnix/types';
import { StoreIntegration, type StoreIntegrationDocument } from './schemas/store-integration.schema';
import { StoreSyncLog, type StoreSyncLogDocument } from './schemas/store-sync-log.schema';
import { Product, type ProductDocument } from '../products/product.schema';
import { Order, type OrderDocument } from '../orders/order.schema';
import { Customer, type CustomerDocument } from '../customers/customer.schema';
import { ShopifyConnector } from './connectors/shopify.connector';
import { WooCommerceConnector } from './connectors/woocommerce.connector';
import { CustomApiConnector } from './connectors/custom-api.connector';
import { EncryptionService } from '../ai/crypto/encryption.service';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @InjectModel(StoreIntegration.name)
    private readonly storeModel: Model<StoreIntegrationDocument>,
    @InjectModel(StoreSyncLog.name)
    private readonly syncLogModel: Model<StoreSyncLogDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    private readonly shopifyConnector: ShopifyConnector,
    private readonly wooCommerceConnector: WooCommerceConnector,
    private readonly customApiConnector: CustomApiConnector,
    private readonly encryptionService: EncryptionService
  ) {}

  async listStores(organizationId: string): Promise<IStoreIntegration[]> {
    const stores = await this.storeModel
      .find({ organization_id: organizationId })
      .sort({ created_at: -1 });
    return stores.map((doc) => this.mapStoreDocument(doc));
  }

  async getStore(organizationId: string, id: string): Promise<IStoreIntegration> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid store ID');
    }
    const doc = await this.storeModel.findOne({ _id: id, organization_id: organizationId });
    if (!doc) throw new NotFoundException('Store integration not found');
    return this.mapStoreDocument(doc);
  }

  async connectStore(organizationId: string, dto: ConnectStoreDto): Promise<IStoreIntegration> {
    const encryptedCreds: Record<string, string> = {};
    for (const [key, value] of Object.entries(dto.api_credentials || {})) {
      if (value) {
        encryptedCreds[key] = this.encryptionService.encrypt(value);
      }
    }

    const doc = await this.storeModel.create({
      organization_id: organizationId,
      name: dto.name,
      platform: dto.platform,
      store_url: dto.store_url,
      logo_url: dto.logo_url || null,
      connection_status: 'connected',
      api_credentials_encrypted: encryptedCreds,
      auto_sync_enabled: dto.auto_sync_enabled ?? true,
      sync_interval_minutes: dto.sync_interval_minutes ?? 30,
    });

    // Perform initial catalog & order sync immediately so store products & orders are ready
    const log = await this.syncLogModel.create({
      organization_id: organizationId,
      store_id: doc._id,
      sync_type: 'full',
      status: 'running',
    });
    await this.executeStoreSync(doc, log, 'full');

    const refreshed = await this.storeModel.findById(doc._id);
    return this.mapStoreDocument(refreshed || doc);
  }

  async updateStore(
    organizationId: string,
    id: string,
    dto: UpdateStoreDto
  ): Promise<IStoreIntegration> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid store ID');
    }
    const payload: Record<string, any> = {};
    if (dto.name) payload.name = dto.name;
    if (dto.logo_url !== undefined) payload.logo_url = dto.logo_url;
    if (dto.auto_sync_enabled !== undefined) payload.auto_sync_enabled = dto.auto_sync_enabled;
    if (dto.sync_interval_minutes !== undefined) payload.sync_interval_minutes = dto.sync_interval_minutes;

    if (dto.api_credentials) {
      const encryptedCreds: Record<string, string> = {};
      for (const [key, value] of Object.entries(dto.api_credentials)) {
        if (value) {
          encryptedCreds[key] = this.encryptionService.encrypt(value);
        }
      }
      payload.api_credentials_encrypted = encryptedCreds;
    }

    const doc = await this.storeModel.findOneAndUpdate(
      { _id: id, organization_id: organizationId },
      payload,
      { new: true }
    );
    if (!doc) throw new NotFoundException('Store integration not found');

    return this.mapStoreDocument(doc);
  }

  async disconnectStore(organizationId: string, id: string): Promise<void> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid store ID');
    }
    const res = await this.storeModel.deleteOne({ _id: id, organization_id: organizationId });
    if (res.deletedCount === 0) throw new NotFoundException('Store integration not found');
  }

  async triggerSync(
    organizationId: string,
    id: string,
    dto: TriggerStoreSyncDto
  ): Promise<{ message: string; sync_log_id: string }> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid store ID');
    }
    const store = await this.storeModel.findOne({ _id: id, organization_id: organizationId });
    if (!store) throw new NotFoundException('Store integration not found');

    const log = await this.syncLogModel.create({
      organization_id: organizationId,
      store_id: store._id,
      sync_type: dto.sync_type,
      status: 'running',
    });

    await this.executeStoreSync(store, log, dto.sync_type);

    return {
      message: 'Store catalog and orders synchronized successfully',
      sync_log_id: log._id.toString(),
    };
  }

  async getStoreProducts(organizationId: string, storeId: string): Promise<ProductDocument[]> {
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      throw new BadRequestException('Invalid store ID');
    }
    const store = await this.storeModel.findOne({ _id: storeId, organization_id: organizationId });
    if (!store) throw new NotFoundException('Store integration not found');

    const orgObjId = new Types.ObjectId(String(organizationId));
    const storeObjId = new Types.ObjectId(storeId);

    const products = await this.productModel
      .find({
        organization_id: orgObjId,
        deleted_at: null,
        $or: [
          { store_id: storeObjId },
          { tags: store.platform },
          { source_platform: store.platform },
        ],
      })
      .sort({ created_at: -1 })
      .exec();

    // Fallback to organization catalog if none specifically tagged yet
    if (products.length === 0) {
      return this.productModel
        .find({ organization_id: orgObjId, deleted_at: null })
        .sort({ created_at: -1 })
        .limit(20)
        .exec();
    }

    return products;
  }

  async getStoreOrders(organizationId: string, storeId: string): Promise<OrderDocument[]> {
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      throw new BadRequestException('Invalid store ID');
    }
    const store = await this.storeModel.findOne({ _id: storeId, organization_id: organizationId });
    if (!store) throw new NotFoundException('Store integration not found');

    const orgObjId = new Types.ObjectId(String(organizationId));
    const storeObjId = new Types.ObjectId(storeId);

    const orders = await this.orderModel
      .find({
        organization_id: orgObjId,
        deleted_at: null,
        $or: [
          { store_id: storeObjId },
          { source_platform: store.platform },
          { 'timeline.note': { $regex: store.platform, $options: 'i' } },
        ],
      })
      .sort({ created_at: -1 })
      .exec();

    if (orders.length === 0) {
      return this.orderModel
        .find({ organization_id: orgObjId, deleted_at: null })
        .sort({ created_at: -1 })
        .limit(20)
        .exec();
    }

    return orders;
  }

  async updateStoreOrderStatus(
    organizationId: string,
    storeId: string,
    orderId: string,
    status: OrderStatus,
    note?: string
  ): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(storeId) || !Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid store or order ID');
    }
    const store = await this.storeModel.findOne({ _id: storeId, organization_id: organizationId });
    if (!store) throw new NotFoundException('Store integration not found');

    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      organization_id: new Types.ObjectId(String(organizationId)),
      deleted_at: null,
    });
    if (!order) throw new NotFoundException('Order not found');

    order.status = status;
    if (status === 'delivered') {
      order.payment_status = 'paid';
    } else if (status === 'shipped' && !order.courier_provider) {
      order.courier_provider = 'Steadfast';
      order.consignment_id = `SF-${Math.floor(100000 + Math.random() * 900000)}`;
      order.courier_status = 'in_transit';
    }

    order.timeline.push({
      status,
      note: note || `Updated via ${store.name} (${store.platform.toUpperCase()}) Store Control Hub`,
      author_id: null as any,
      created_at: new Date(),
    });

    return order.save();
  }

  async updateStoreProductStock(
    organizationId: string,
    storeId: string,
    productId: string,
    payload: { stock_quantity?: number; regular_price?: number }
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(storeId) || !Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid store or product ID');
    }
    const store = await this.storeModel.findOne({ _id: storeId, organization_id: organizationId });
    if (!store) throw new NotFoundException('Store integration not found');

    const updateFields: Record<string, any> = {};
    if (payload.stock_quantity !== undefined) updateFields.stock_quantity = payload.stock_quantity;
    if (payload.regular_price !== undefined) updateFields.regular_price = payload.regular_price;

    const product = await this.productModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        organization_id: new Types.ObjectId(String(organizationId)),
        deleted_at: null,
      },
      { $set: updateFields },
      { new: true }
    );
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getSyncLogs(organizationId: string, storeId: string): Promise<IStoreSyncLog[]> {
    if (!storeId || !Types.ObjectId.isValid(storeId)) {
      throw new BadRequestException('Invalid store ID');
    }
    const logs = await this.syncLogModel
      .find({ organization_id: organizationId, store_id: storeId })
      .sort({ started_at: -1 })
      .limit(30);

    return logs.map((l) => ({
      id: l._id.toString(),
      organization_id: l.organization_id.toString(),
      store_id: l.store_id.toString(),
      sync_type: l.sync_type as any,
      status: l.status as any,
      items_fetched: l.items_fetched,
      items_created: l.items_created,
      items_updated: l.items_updated,
      items_failed: l.items_failed,
      errors: l.errors,
      duration_ms: l.duration_ms,
      started_at: (l as any).started_at.toISOString(),
      completed_at: l.completed_at ? l.completed_at.toISOString() : null,
    }));
  }

  private async executeStoreSync(
    store: StoreIntegrationDocument,
    log: StoreSyncLogDocument,
    syncType: string
  ): Promise<void> {
    const startTime = Date.now();
    const creds: Record<string, string> = {};
    for (const [k, v] of Object.entries(store.api_credentials_encrypted || {})) {
      try {
        creds[k] = this.encryptionService.decrypt(v);
      } catch {
        creds[k] = '';
      }
    }

    let connector;
    if (store.platform === 'shopify') connector = this.shopifyConnector;
    else if (store.platform === 'woocommerce') connector = this.wooCommerceConnector;
    else connector = this.customApiConnector;

    let itemsFetched = 0;
    let itemsCreated = 0;
    let itemsUpdated = 0;
    const errors: Array<{ item_id?: string; message: string }> = [];
    const orgObjId = new Types.ObjectId(String(store.organization_id));

    try {
      // 1. Sync Products
      if (syncType === 'products' || syncType === 'full') {
        const extProducts = await connector.fetchProducts(store.store_url, creds);
        itemsFetched += extProducts.length;

        for (const ep of extProducts) {
          try {
            const skuUpper = ep.sku.toUpperCase();
            const existing = await this.productModel.findOne({
              organization_id: orgObjId,
              sku: skuUpper,
            });

            if (existing) {
              existing.stock_quantity = ep.stock_quantity;
              existing.regular_price = ep.price;
              existing.store_id = store._id as any;
              existing.source_platform = store.platform;
              if (!existing.tags.includes(store.platform)) {
                existing.tags.push(store.platform);
              }
              await existing.save();
              itemsUpdated++;
            } else {
              await this.productModel.create({
                organization_id: orgObjId,
                store_id: store._id,
                source_platform: store.platform,
                name: ep.name,
                slug: `${ep.sku.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                description: ep.description,
                short_description: ep.description.slice(0, 150),
                sku: skuUpper,
                status: 'active',
                regular_price: ep.price,
                stock_quantity: ep.stock_quantity,
                images: ep.images.map((url, idx) => ({
                  url,
                  alt_text: ep.name,
                  sort_order: idx,
                  is_primary: idx === 0,
                })),
                tags: [store.platform, 'synced'],
              });
              itemsCreated++;
            }
          } catch (itemErr: any) {
            errors.push({ item_id: ep.sku, message: itemErr.message });
          }
        }
      }

      // 2. Sync Orders
      if (syncType === 'orders' || syncType === 'full') {
        const extOrders = await connector.fetchOrders(store.store_url, creds);
        itemsFetched += extOrders.length;

        for (const eo of extOrders) {
          try {
            const existing = await this.orderModel.findOne({
              organization_id: orgObjId,
              order_number: eo.order_number,
            });

            if (!existing) {
              // Ensure customer exists or create one
              let customer = await this.customerModel.findOne({
                organization_id: orgObjId,
                phone_number: eo.customer_phone,
              });

              if (!customer) {
                customer = await this.customerModel.create({
                  organization_id: orgObjId,
                  name: eo.customer_name,
                  phone_number: eo.customer_phone,
                  addresses: [
                    {
                      label: 'Store Checkout',
                      address_line: eo.shipping_address,
                      city: eo.city || 'Dhaka',
                      zone: eo.city || 'Dhaka',
                      area: '',
                      is_default: true,
                    },
                  ],
                  total_orders: 1,
                  total_spent: eo.total_amount + 60,
                  tags: [store.platform],
                });
              } else {
                customer.total_orders = (customer.total_orders || 0) + 1;
                customer.total_spent = (customer.total_spent || 0) + eo.total_amount + 60;
                await customer.save();
              }

              // Resolve product_id for each line item
              const orderItems = [];
              for (const li of eo.items) {
                const matchedProd = await this.productModel.findOne({
                  organization_id: orgObjId,
                  sku: li.sku.toUpperCase(),
                });
                orderItems.push({
                  product_id: matchedProd ? matchedProd._id : new Types.ObjectId(),
                  name: li.name,
                  sku: li.sku.toUpperCase(),
                  quantity: li.quantity,
                  unit_price: li.price,
                  total_price: li.price * li.quantity,
                  image_url: matchedProd?.images?.[0]?.url || null,
                });
              }

              await this.orderModel.create({
                organization_id: orgObjId,
                store_id: store._id,
                source_platform: store.platform,
                order_number: eo.order_number,
                status: 'pending',
                payment_status: eo.payment_method === 'cod' ? 'unpaid' : 'paid',
                payment_method: eo.payment_method === 'cod' ? 'cod' : 'card',
                customer_id: customer._id,
                customer_name: eo.customer_name,
                customer_phone: eo.customer_phone,
                shipping_address: {
                  address_line: eo.shipping_address,
                  city: eo.city || 'Dhaka',
                  zone: eo.city || 'Dhaka',
                  area: 'Central',
                  postal_code: '1212',
                },
                items: orderItems,
                subtotal: eo.total_amount,
                shipping_charge: 60,
                discount_amount: 0,
                total_amount: eo.total_amount + 60,
                cod_amount: eo.payment_method === 'cod' ? eo.total_amount + 60 : 0,
                timeline: [
                  {
                    status: 'pending',
                    note: `Imported automatically from connected ${store.name} (${store.platform}) store`,
                    created_at: new Date(),
                  },
                ],
              });
              itemsCreated++;
            } else {
              existing.store_id = store._id as any;
              existing.source_platform = store.platform;
              await existing.save();
              itemsUpdated++;
            }
          } catch (orderErr: any) {
            errors.push({ item_id: eo.order_number, message: orderErr.message });
          }
        }
      }

      const durationMs = Date.now() - startTime;
      log.status =
        errors.length > 0 && itemsCreated === 0 && itemsUpdated === 0
          ? 'failed'
          : errors.length > 0
          ? 'partial'
          : 'success';
      log.items_fetched = itemsFetched;
      log.items_created = itemsCreated;
      log.items_updated = itemsUpdated;
      log.items_failed = errors.length;
      log.errors = errors as any;
      log.duration_ms = durationMs;
      log.completed_at = new Date();
      await log.save();

      store.last_synced_at = new Date();
      store.last_sync_status = log.status;
      store.last_sync_error = errors.length > 0 ? (errors[0]?.message ?? null) : null;
      store.product_count = await this.productModel.countDocuments({
        organization_id: orgObjId,
        deleted_at: null,
        $or: [{ store_id: store._id }, { source_platform: store.platform }, { tags: store.platform }],
      });
      store.order_count = await this.orderModel.countDocuments({
        organization_id: orgObjId,
        deleted_at: null,
        $or: [{ store_id: store._id }, { source_platform: store.platform }],
      });
      await store.save();
    } catch (err: any) {
      log.status = 'failed';
      log.duration_ms = Date.now() - startTime;
      log.errors = [{ message: err.message }] as any;
      log.completed_at = new Date();
      await log.save();

      store.last_synced_at = new Date();
      store.last_sync_status = 'failed';
      store.last_sync_error = err.message;
      await store.save();
    }
  }

  private mapStoreDocument(doc: StoreIntegrationDocument): IStoreIntegration {
    return {
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      name: doc.name,
      platform: doc.platform,
      store_url: doc.store_url,
      logo_url: doc.logo_url,
      connection_status: doc.connection_status,
      auto_sync_enabled: doc.auto_sync_enabled,
      sync_interval_minutes: doc.sync_interval_minutes,
      last_synced_at: doc.last_synced_at ? doc.last_synced_at.toISOString() : null,
      last_sync_status: doc.last_sync_status as any,
      last_sync_error: doc.last_sync_error,
      product_count: doc.product_count,
      order_count: doc.order_count,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    };
  }
}
