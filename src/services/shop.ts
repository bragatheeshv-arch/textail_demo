import { products, productBySlug } from '../data/products';
import type { Product } from '../types/product';

// Production seam: swap demo functions with API calls without touching UI.
export const ProductService = {
  list: async (): Promise<Product[]> => products,
  bySlug: async (slug: string): Promise<Product | undefined> => productBySlug(slug),
  related: async (p: Product, n = 4): Promise<Product[]> =>
    products.filter((x) => x.id !== p.id && (x.material === p.material || x.pattern === p.pattern)).slice(0, n),
};

export interface DemoOrder { id: string; totalPaise: number; email: string; lines: number }

export const CheckoutService = {
  // DEMO ONLY — simulates order creation client-side. Real integration must
  // validate prices/inventory/coupons server-side and verify payment webhooks.
  placeDemoOrder: async (email: string, totalPaise: number, lines: number): Promise<DemoOrder> => {
    await new Promise((r) => setTimeout(r, 900));
    return { id: `AF-DEMO-${Date.now().toString().slice(-6)}`, totalPaise, email, lines };
  },
};
