import { create } from 'zustand';
import type { CartLine, OrderSummary } from '../types/cart';
import { storeConfig } from '../config/store';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}

interface CartState {
  lines: CartLine[];
  add: (line: CartLine) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  summary: () => OrderSummary;
  count: () => number;
}

export const useCart = create<CartState>()((set, get) => ({
  lines: typeof window !== 'undefined' ? load<CartLine[]>('af-cart', []) : [],
  add: (line) => set((s) => {
    const ex = s.lines.find((l) => l.productId === line.productId);
    const lines = ex
      ? s.lines.map((l) => (l.productId === line.productId ? { ...l, qty: Math.min(99, +(l.qty + line.qty).toFixed(2)) } : l))
      : [...s.lines, line];
    try { localStorage.setItem('af-cart', JSON.stringify(lines)); } catch { /* noop */ }
    return { lines };
  }),
  remove: (productId) => set((s) => {
    const lines = s.lines.filter((l) => l.productId !== productId);
    try { localStorage.setItem('af-cart', JSON.stringify(lines)); } catch { /* noop */ }
    return { lines };
  }),
  setQty: (productId, qty) => set((s) => {
    const lines = s.lines.map((l) => (l.productId === productId ? { ...l, qty } : l)).filter((l) => l.qty > 0);
    try { localStorage.setItem('af-cart', JSON.stringify(lines)); } catch { /* noop */ }
    return { lines };
  }),
  clear: () => set(() => {
    try { localStorage.removeItem('af-cart'); } catch { /* noop */ }
    return { lines: [] };
  }),
  summary: () => {
    const lines = get().lines;
    const subtotal = lines.reduce((a, l) => a + Math.round(l.unitPricePaise * l.qty), 0);
    const shipping = subtotal === 0 || subtotal >= storeConfig.freeShippingThresholdPaise ? 0 : storeConfig.shippingFlatPaise;
    return {
      subtotalPaise: subtotal, discountPaise: 0, shippingPaise: shipping,
      totalPaise: subtotal + shipping, lines: lines.length,
      freeShipProgress: Math.min(1, subtotal / storeConfig.freeShippingThresholdPaise),
    };
  },
  count: () => get().lines.reduce((a, l) => a + l.qty, 0),
}));
