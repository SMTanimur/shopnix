import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateProfitMargin } from '../src/currency';
import { generateSlug } from '../src/slug';

describe('Currency and Calculation Utilities', () => {
  it('should format currency with BDT symbol by default', () => {
    expect(formatCurrency(1250)).toBe('৳1,250');
    expect(formatCurrency(0)).toBe('৳0');
    expect(formatCurrency(null)).toBe('৳0');
    expect(formatCurrency(undefined)).toBe('৳0');
  });

  it('should calculate profit margin correctly', () => {
    // Selling price: 1000, Cost price: 700 => Profit: 300 => 30% margin
    expect(calculateProfitMargin(1000, 700)).toBe(30);

    // Selling price: 500, Cost price: 250 => Profit: 250 => 50% margin
    expect(calculateProfitMargin(500, 250)).toBe(50);

    // Invalid or missing cost price
    expect(calculateProfitMargin(500, null)).toBe(0);
    expect(calculateProfitMargin(0, 200)).toBe(0);
  });
});

describe('Slug Generator', () => {
  it('should transform text to lowercase hyphenated slug', () => {
    expect(generateSlug('Premium Cotton Panjabi')).toBe('premium-cotton-panjabi');
    expect(generateSlug('Style & Elegance #2026')).toBe('style-elegance-2026');
    expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
  });
});
