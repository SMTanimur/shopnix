import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({ collection: 'subscription_plans', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class SubscriptionPlan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  code: string;

  @Prop({ required: true, default: 0 })
  monthly_price_bdt: number;

  @Prop({ required: true, default: 0 })
  yearly_price_bdt: number;

  @Prop({
    type: {
      max_stores: { type: Number, default: 1 },
      max_orders_per_month: { type: Number, default: 100 },
      max_products: { type: Number, default: 50 },
      max_ai_tokens_per_month: { type: Number, default: 50000 },
      max_team_members: { type: Number, default: 2 },
    },
    default: {},
  })
  limits: {
    max_stores: number;
    max_orders_per_month: number;
    max_products: number;
    max_ai_tokens_per_month: number;
    max_team_members: number;
  };

  @Prop({
    type: {
      whatsapp_enabled: { type: Boolean, default: false },
      messenger_enabled: { type: Boolean, default: false },
      automations_enabled: { type: Boolean, default: false },
      ai_copilot_enabled: { type: Boolean, default: false },
      ai_agents_enabled: { type: Boolean, default: false },
      courier_integrations_enabled: { type: Boolean, default: true },
    },
    default: {},
  })
  features: {
    whatsapp_enabled: boolean;
    messenger_enabled: boolean;
    automations_enabled: boolean;
    ai_copilot_enabled: boolean;
    ai_agents_enabled: boolean;
    courier_integrations_enabled: boolean;
  };

  @Prop({ default: true })
  is_active: boolean;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);
