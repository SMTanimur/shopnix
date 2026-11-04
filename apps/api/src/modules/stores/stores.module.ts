import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreIntegration, StoreIntegrationSchema } from './schemas/store-integration.schema';
import { StoreSyncLog, StoreSyncLogSchema } from './schemas/store-sync-log.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { Order, OrderSchema } from '../orders/order.schema';
import { Customer, CustomerSchema } from '../customers/customer.schema';
import { ShopifyConnector } from './connectors/shopify.connector';
import { WooCommerceConnector } from './connectors/woocommerce.connector';
import { CustomApiConnector } from './connectors/custom-api.connector';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StoreIntegration.name, schema: StoreIntegrationSchema },
      { name: StoreSyncLog.name, schema: StoreSyncLogSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    AIModule,
  ],
  controllers: [StoresController],
  providers: [
    ShopifyConnector,
    WooCommerceConnector,
    CustomApiConnector,
    StoresService,
  ],
  exports: [StoresService],
})
export class StoresModule {}
