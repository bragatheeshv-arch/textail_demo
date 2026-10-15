import type { Product } from '../types/product';

export interface FilterState {
  materials: string[];
  colors: string[];
  patterns: string[];
  categories: string[];
  saleOnly: boolean;
  inStockOnly: boolean;
  maxPricePaise: number | null;
  query: string;
}

export const emptyFilters: FilterState = {
  materials: [], colors: [], patterns: [], categories: [],
  saleOnly: false, inStockOnly: false, maxPricePaise: null, query: '',
};

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name' | 'discount';

export function applyFilters(products: Product[], f: FilterState): Product[] {
  return products.filter((p) => {
    if (f.materials.length && !f.materials.includes(p.material)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.patterns.length && !f.patterns.includes(p.pattern)) return false;
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c))) return false;
    if (f.saleOnly && !(p.compareAtPaise && p.compareAtPaise > p.pricePaise)) return false;
    if (f.inStockOnly && p.stockStatus === 'out') return false;
    if (f.maxPricePaise != null && p.pricePaise > f.maxPricePaise) return false;
    if (f.query) {
      const q = f.query.toLowerCase();
      const hay = `${p.title} ${p.material} ${p.pattern} ${p.category} ${p.sku} ${p.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function applySort(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  switch (sort) {
    case 'price-asc': return arr.sort((a, b) => a.pricePaise - b.pricePaise);
    case 'price-desc': return arr.sort((a, b) => b.pricePaise - a.pricePaise);
    case 'name': return arr.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest': return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case 'discount':
      return arr.sort((a, b) => {
        const da = a.compareAtPaise ? (a.compareAtPaise - a.pricePaise) / a.compareAtPaise : 0;
        const db = b.compareAtPaise ? (b.compareAtPaise - b.pricePaise) / b.compareAtPaise : 0;
        return db - da;
      });
    default:
      return arr.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
}

export function searchProducts(products: Product[], q: string, limit = 8): Product[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const scored = products
    .map((p) => {
      const title = p.title.toLowerCase();
      let score = -1;
      if (title.startsWith(query)) score = 0;
      else if (title.includes(query)) score = 1;
      else if (`${p.material} ${p.pattern} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(query)) score = 2;
      else if (p.sku.toLowerCase().includes(query)) score = 3;
      return { p, score };
    })
    .filter((s) => s.score >= 0)
    .sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((s) => s.p);
}
