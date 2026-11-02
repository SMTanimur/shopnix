import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  createProductSchema,
  createOrderSchema,
  stockAdjustmentSchema,
} from '../src';

describe('Shared Zod Schemas Validation', () => {
  it('should validate correct login credentials', () => {
    const valid = { email: 'user@shopnix.com', password: 'password123' };
    const result = loginSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format in login', () => {
    const invalid = { email: 'not-an-email', password: 'password123' };
    const result = loginSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should validate complete register input', () => {
    const valid = {
      first_name: 'Tanvir',
      last_name: 'Ahmed',
      email: 'tanvir@brand.com',
      password: 'strongpassword123',
      phone_number: '01712345678',
      store_name: 'Panjabi House',
    };
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should validate product creation schema', () => {
    const valid = {
      name: 'Men Slim Fit Shirt',
      sku: 'SHIRT-001',
      regular_price: 1200,
      stock_quantity: 25,
    };
    const result = createProductSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject product creation without SKU or Name', () => {
    const invalid = { regular_price: 1200 };
    const result = createProductSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should validate inventory stock adjustment and disallow delta of 0', () => {
    const valid = {
      product_id: '507f1f77bcf86cd799439011',
      quantity_change: 10,
      type: 'restock',
    };
    expect(stockAdjustmentSchema.safeParse(valid).success).toBe(true);

    const zeroDelta = {
      product_id: '507f1f77bcf86cd799439011',
      quantity_change: 0,
      type: 'restock',
    };
    expect(stockAdjustmentSchema.safeParse(zeroDelta).success).toBe(false);
  });
});
