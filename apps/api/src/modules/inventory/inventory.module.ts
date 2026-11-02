import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryMovement, InventoryMovementSchema } from './inventory-movement.schema';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryMovement.name, schema: InventoryMovementSchema },
    ]),
    ProductsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService, MongooseModule],
})
export class InventoryModule {}
