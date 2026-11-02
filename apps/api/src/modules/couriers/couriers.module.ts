import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourierConfiguration,
  CourierConfigurationSchema,
} from './courier-configuration.schema';
import { CouriersService } from './couriers.service';
import { CouriersController } from './couriers.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourierConfiguration.name, schema: CourierConfigurationSchema },
    ]),
    OrdersModule,
  ],
  controllers: [CouriersController],
  providers: [CouriersService],
  exports: [CouriersService, MongooseModule],
})
export class CouriersModule {}
