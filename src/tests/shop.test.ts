import { describe, expect, it } from 'vitest';
import { discountPct, formatINR, lineTotal } from '../lib/currency';
import { applyFilters, applySort, emptyFilters, searchProducts } from '../lib/filters';
import { products } from '../data/products';

describe('currency', () => {
  it('formats INR and computes discount + line totals in paise', () => {
    expect(formatINR(29900)).toContain('299');
    expect(discountPct(29900, 32900)).toBe(9);
    expect(lineTotal(34900, 2.5)).toBe(87250);
  });
});

describe('catalog', () => {
  it('filters combine and reset', () => {
    const all = applyFilters(products, emptyFilters);
    expect(all.length).toBe(products.length);
    const cotton = applyFilters(products, { ...emptyFilters, materials: ['Cotton'] });
    expect(cotton.length).toBeGreaterThan(0);
    expect(cotton.every((p) => p.material === 'Cotton')).toBe(true);
  });
  it('sorts price low to high', () => {
    const sorted = applySort(products, 'price-asc');
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].pricePaise).toBeGreaterThanOrEqual(sorted[i - 1].pricePaise);
  });
  it('searches by title/material/sku', () => {
    expect(searchProducts(products, 'floral').length).toBeGreaterThan(0);
    expect(searchProducts(products, 'FAB1001')[0].sku).toBe('FAB1001');
    expect(searchProducts(products, 'zzz-no-match')).toHaveLength(0);
  });
});
