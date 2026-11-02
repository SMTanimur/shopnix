import { describe, it, expect } from 'vitest';
import {
  connectStoreSchema,
  sendMessageSchema,
  aiCompletionRequestSchema,
  createWorkflowSchema,
  adminLoginSchema,
  createSubscriptionPlanSchema,
} from '../src';

describe('Shopnix v2 Schemas Test Suite', () => {
  describe('connectStoreSchema', () => {
    it('validates a valid Shopify store input', () => {
      const valid = {
        name: 'My Dhaka Store',
        platform: 'shopify' as const,
        store_url: 'https://dhakastore.myshopify.com',
        api_credentials: { access_token: 'shpat_12345678' },
        auto_sync_enabled: true,
        sync_interval_minutes: 30,
      };

      const parsed = connectStoreSchema.parse(valid);
      expect(parsed.name).toBe('My Dhaka Store');
      expect(parsed.platform).toBe('shopify');
    });

    it('rejects invalid URLs', () => {
      const invalid = {
        name: 'Invalid Store',
        platform: 'shopify' as const,
        store_url: 'not-a-url',
        api_credentials: {},
      };

      expect(() => connectStoreSchema.parse(invalid)).toThrow();
    });
  });

  describe('sendMessageSchema', () => {
    it('accepts valid text messages', () => {
      const msg = {
        content: 'Your order has been dispatched via Steadfast Courier!',
        type: 'text' as const,
      };
      const parsed = sendMessageSchema.parse(msg);
      expect(parsed.content).toContain('Steadfast');
    });

    it('rejects empty message content', () => {
      expect(() => sendMessageSchema.parse({ content: '' })).toThrow();
    });
  });

  describe('aiCompletionRequestSchema', () => {
    it('defaults routing mode to free_only', () => {
      const req = {
        feature: 'product_copy',
        prompt: 'Generate product description for silk saree',
      };
      const parsed = aiCompletionRequestSchema.parse(req);
      expect(parsed.routing_mode).toBe('free_only');
    });

    it('accepts valid routing modes', () => {
      const req = {
        feature: 'ai_assistant',
        prompt: 'Check stock',
        routing_mode: 'fallback' as const,
        provider: 'openrouter' as const,
      };
      const parsed = aiCompletionRequestSchema.parse(req);
      expect(parsed.routing_mode).toBe('fallback');
    });
  });

  describe('createWorkflowSchema', () => {
    it('validates a visual automation workflow', () => {
      const wf = {
        name: 'New Order WhatsApp Alert',
        trigger_type: 'order.created' as const,
        nodes: [
          {
            id: 'n1',
            type: 'trigger',
            position: { x: 0, y: 0 },
            data: { label: 'Order Trigger', nodeType: 'trigger' as const },
          },
        ],
        edges: [],
      };
      const parsed = createWorkflowSchema.parse(wf);
      expect(parsed.trigger_type).toBe('order.created');
      expect(parsed.nodes).toHaveLength(1);
    });
  });

  describe('adminLoginSchema', () => {
    it('validates admin email and password', () => {
      const parsed = adminLoginSchema.parse({
        email: 'admin@shopnix.io',
        password: 'ShopnixAdmin2026!',
      });
      expect(parsed.email).toBe('admin@shopnix.io');
    });
  });

  describe('createSubscriptionPlanSchema', () => {
    it('validates subscription plan limits and feature entitlements', () => {
      const plan = {
        name: 'Growth Plan',
        code: 'growth',
        monthly_price_bdt: 2499,
        yearly_price_bdt: 24990,
        limits: {
          max_stores: 3,
          max_orders_per_month: 1000,
          max_products: 500,
          max_ai_tokens_per_month: 500000,
          max_team_members: 5,
        },
        features: {
          whatsapp_enabled: true,
          messenger_enabled: true,
          automations_enabled: true,
          ai_copilot_enabled: true,
          ai_agents_enabled: true,
          courier_integrations_enabled: true,
        },
      };

      const parsed = createSubscriptionPlanSchema.parse(plan);
      expect(parsed.code).toBe('growth');
      expect(parsed.limits.max_stores).toBe(3);
      expect(parsed.features.whatsapp_enabled).toBe(true);
    });
  });
});
