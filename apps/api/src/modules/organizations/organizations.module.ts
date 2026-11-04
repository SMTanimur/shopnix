import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './organization.schema';
import { Order, OrderSchema } from '../orders/order.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { StoreIntegration, StoreIntegrationSchema } from '../stores/schemas/store-integration.schema';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: StoreIntegration.name, schema: StoreIntegrationSchema },
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService, MongooseModule],
})
export class OrganizationsModule {}
