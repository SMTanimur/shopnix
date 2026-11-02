import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CustomersModule } from './modules/customers/customers.module';
import { CouriersModule } from './modules/couriers/couriers.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { AIModule } from './modules/ai/ai.module';
import { StoresModule } from './modules/stores/stores.module';
import { InboxModule } from './modules/inbox/inbox.module';
import { AutomationModule } from './modules/automation/automation.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProductsModule,
    OrdersModule,
    InventoryModule,
    CustomersModule,
    CouriersModule,
    AnalyticsModule,
    AIModule,
    StoresModule,
    InboxModule,
    AutomationModule,
    AdminModule,
  ],
})
export class AppModule {}
