import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminUser, AdminUserSchema } from './schemas/admin-user.schema';
import { SubscriptionPlan, SubscriptionPlanSchema } from './schemas/subscription-plan.schema';
import { AdminAuditLog, AdminAuditLogSchema } from './schemas/admin-audit-log.schema';
import { Organization, OrganizationSchema } from '../organizations/organization.schema';
import { User, UserSchema } from '../users/user.schema';
import { Order, OrderSchema } from '../orders/order.schema';
import { AIUsage, AIUsageSchema } from '../ai/schemas/ai-usage.schema';
import {
  WorkflowDefinition,
  WorkflowDefinitionSchema,
} from '../automation/schemas/workflow-definition.schema';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('ADMIN_JWT_SECRET') ||
          'super-secret-admin-jwt-token-key-change-in-production-min-32',
        signOptions: { expiresIn: 43200 },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: AdminAuditLog.name, schema: AdminAuditLogSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: AIUsage.name, schema: AIUsageSchema },
      { name: WorkflowDefinition.name, schema: WorkflowDefinitionSchema },
    ]),
    AIModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminJwtAuthGuard],
  exports: [AdminService],
})
export class AdminModule {}
