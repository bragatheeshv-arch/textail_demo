import { products } from './products';

// ---------------------------------------------------------------------------
// Demo analytics dataset. Deterministic (seeded PRNG) so builds and screenshots
// are stable. ALL figures are random placeholder data for UI purposes —
// replace with real backend analytics before any production use.
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261015);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) => min + rand() * (max - min);
const intBetween = (min: number, max: number) => Math.round(between(min, max));

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export interface MonthPoint { month: string; revenuePaise: number; orders: number; visitors: number }

const growth = MONTHS.map((_, i) => 0.72 + (i / (MONTHS.length - 1)) * 0.55 + (rand() - 0.5) * 0.16);

export const salesSeries: MonthPoint[] = MONTHS.map((month, i) => ({
  month,
  revenuePaise: Math.round(18500000 * growth[i]),
  orders: Math.round(640 * growth[i] + (rand() - 0.5) * 60),
  visitors: Math.round(38500 * growth[i] + (rand() - 0.5) * 2500),
}));

const totalRevenue = salesSeries.reduce((a, m) => a + m.revenuePaise, 0);
const totalOrders = salesSeries.reduce((a, m) => a + m.orders, 0);
const totalVisitors = salesSeries.reduce((a, m) => a + m.visitors, 0);
const last = salesSeries[salesSeries.length - 1];
const prev = salesSeries[salesSeries.length - 2];

export const kpis = {
  revenuePaise: totalRevenue,
  revenueGrowthPct: Math.round(((last.revenuePaise - prev.revenuePaise) / prev.revenuePaise) * 100),
  orders: totalOrders,
  ordersGrowthPct: Math.round(((last.orders - prev.orders) / prev.orders) * 100),
  avgOrderPaise: Math.round(totalRevenue / totalOrders),
  conversionPct: +(totalOrders / totalVisitors * 100).toFixed(2),
  visitors: totalVisitors,
};

export interface TopProductRow { slug: string; title: string; material: string; units: number; revenuePaise: number; trendPct: number }

const pool = [...products];
export const topProducts: TopProductRow[] = Array.from({ length: 6 }, () => {
  const p = pool.splice(Math.floor(rand() * pool.length), 1)[0];
  const units = intBetween(180, 940);
  return {
    slug: p.slug, title: p.title, material: p.material, units,
    revenuePaise: Math.round(p.pricePaise * units * between(0.85, 1.1)),
    trendPct: intBetween(-8, 34),
  };
}).sort((a, b) => b.revenuePaise - a.revenuePaise);

const FIRST = ['Aarav', 'Diya', 'Ishaan', 'Meera', 'Kabir', 'Anaya', 'Vivaan', 'Sara', 'Arjun', 'Priya', 'Rohan', 'Neha'];
const LAST = ['Sharma', 'Patel', 'Reddy', 'Iyer', 'Khan', 'Gupta', 'Nair', 'Das', 'Kaur', 'Joshi'];
const STATUS = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Shipped', 'Processing', 'Processing', 'Cancelled'] as const;

export interface RecentOrder { id: string; customer: string; city: string; items: number; totalPaise: number; status: (typeof STATUS)[number]; date: string }
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Jaipur', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Surat'];

export const recentOrders: RecentOrder[] = Array.from({ length: 10 }, (_, i) => ({
  id: `AF-${82410 - i * intBetween(3, 17)}`,
  customer: `${pick(FIRST)} ${pick(LAST)}`,
  city: pick(CITIES),
  items: intBetween(1, 6),
  totalPaise: intBetween(49900, 899900),
  status: pick([...STATUS]),
  date: `Oct ${intBetween(1, 14)}, 2026`,
}));

export const trafficSources = [
  { label: 'Organic search', pct: 34 },
  { label: 'Instagram', pct: 24 },
  { label: 'Direct', pct: 18 },
  { label: 'Referrals', pct: 14 },
  { label: 'Email', pct: 10 },
];

const catCounts = new Map<string, number>();
products.forEach((p) => catCounts.set(p.category, (catCounts.get(p.category) ?? 0) + 1));
export const inventoryByCategory = [...catCounts.entries()]
  .map(([label, count]) => ({ label, count, valuePaise: Math.round(count * between(280000, 520000)) }))
  .sort((a, b) => b.count - a.count);

export const lowStock = products.filter((p) => p.stockStatus !== 'in').slice(0, 6);
