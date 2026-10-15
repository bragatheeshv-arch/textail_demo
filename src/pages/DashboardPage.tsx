import { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { kpis, salesSeries, topProducts, recentOrders, trafficSources, inventoryByCategory, lowStock } from '../data/dashboard';
import { fabricPool } from '../data/fabricImages';
import { formatINR } from '../lib/currency';
import ProductImage from '../components/product/ProductImage';
import { products } from '../data/products';

const imgFor = (slug: string) => products.find((p) => p.slug === slug)?.images[0] ?? fabricPool[0];

export default function DashboardPage() {
  useEffect(() => { document.title = 'Dashboard — ATELIER FABRICS (demo data)'; }, []);
  const maxRev = Math.max(...salesSeries.map((s) => s.revenuePaise));
  return (
    <main className="container-x py-10">
      <p className="text-[12px] tracking-[0.2em] uppercase text-burgundy border border-burgundy w-fit px-2 py-1 mb-3">Demo — random placeholder analytics</p>
      <h1 className="font-serif-d text-[clamp(32px,4vw,54px)]">Store dashboard</h1>
      <p className="text-charcoal mt-1 mb-8">Random data across categories, products and orders. Replace with real backend before production.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { l: 'Revenue (12 mo)', v: formatINR(kpis.revenuePaise), d: `+${kpis.revenueGrowthPct}% MoM` },
          { l: 'Orders', v: kpis.orders.toLocaleString('en-IN'), d: `+${kpis.ordersGrowthPct}% MoM` },
          { l: 'Avg order', v: formatINR(kpis.avgOrderPaise), d: `${kpis.conversionPct}% conv.` },
          { l: 'Visitors', v: kpis.visitors.toLocaleString('en-IN'), d: '12-month window' },
        ].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="border border-line bg-paper p-5 hover:shadow-[0_18px_50px_-20px_rgba(36,33,31,0.35)] hover:-translate-y-0.5 transition">
            <p className="text-[12px] uppercase tracking-[0.16em] text-charcoal">{k.l}</p>
            <p className="font-serif-d text-[30px] mt-1">{k.v}</p>
            <p className="text-[13px] text-olive font-semibold mt-1 animate-pulse">{k.d}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-8">
        <section className="border border-line bg-paper p-6">
          <h2 className="font-serif-d text-2xl mb-1">Revenue by month</h2>
          <p className="text-[13px] text-charcoal mb-5">Seasonal curve with Festivals + Wedding edit peaks.</p>
          <div className="flex items-end gap-2 h-44">
            {salesSeries.map((m, i) => (
              <motion.div key={m.month} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 120 }}
                className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-burgundy to-rose group relative"
                style={{ height: `${Math.round((m.revenuePaise / maxRev) * 100)}%` }} title={`${m.month}: ${formatINR(m.revenuePaise)}`}>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] opacity-0 group-hover:opacity-100 transition bg-ink text-paper px-1.5 py-0.5 whitespace-nowrap">{m.month}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">{salesSeries.map((m) => (<span key={m.month} className="flex-1 text-center text-[11px] text-charcoal">{m.month}</span>))}</div>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="font-serif-d text-2xl mb-4">Traffic mix</h2>
          {trafficSources.map((t, i) => (
            <div key={t.label} className="mb-3">
              <div className="flex justify-between text-[13px] mb-1"><span>{t.label}</span><span className="font-bold">{t.pct}%</span></div>
              <div className="h-2 bg-sand rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${t.pct}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }} className="h-full bg-olive" /></div>
            </div>
          ))}
          <h2 className="font-serif-d text-2xl mt-6 mb-3">Inventory by category</h2>
          <div className="flex flex-wrap gap-2">
            {inventoryByCategory.map((c) => (
              <Link key={c.label} to={`/collections`} className="border border-line px-3 py-1.5 text-[13px] hover:border-burgundy hover:-translate-y-0.5 transition">{c.label} · {c.count}</Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <section className="border border-line bg-paper p-6">
          <h2 className="font-serif-d text-2xl mb-4">Top products (random demo)</h2>
          <ul className="divide-y divide-line">
            {topProducts.map((t) => (
              <li key={t.slug} className="flex items-center gap-3 py-2.5 group">
                <span className="h-14 w-12 overflow-hidden border border-line shrink-0 group-hover:scale-105 transition"><ProductImage token={imgFor(t.slug)} alt={t.title} className="h-full w-full" /></span>
                <span className="flex-1 min-w-0"><Link to={`/products/${t.slug}`} className="font-semibold text-[14px] truncate block hover:text-burgundy">{t.title}</Link>
                  <span className="text-[12.5px] text-charcoal">{t.material} · {t.units} units</span></span>
                <span className="text-right"><span className="block font-bold text-[14px]">{formatINR(t.revenuePaise)}</span>
                  <span className={`text-[12px] ${t.trendPct >= 0 ? 'text-olive' : 'text-burgundy'}`}>{t.trendPct >= 0 ? '▲' : '▼'} {t.trendPct}%</span></span>
              </li>
            ))}
          </ul>
        </section>
        <section className="border border-line bg-paper p-6">
          <h2 className="font-serif-d text-2xl mb-4">Recent orders (random demo)</h2>
          <ul className="divide-y divide-line">
            {recentOrders.slice(0, 8).map((o) => (
              <li key={o.id} className="flex justify-between py-2.5 text-[13.5px]">
                <span><span className="font-bold">{o.id}</span> <span className="text-charcoal">· {o.customer}, {o.city}</span><br /><span className="text-charcoal">{o.items} items · {o.date}</span></span>
                <span className="text-right"><span className="block font-bold">{formatINR(o.totalPaise)}</span>
                  <span className="text-[12px] border border-line px-1.5 py-0.5">{o.status}</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {lowStock.length > 0 && (
        <section className="mt-8 border border-line bg-ivory p-6">
          <h2 className="font-serif-d text-2xl mb-1">Low / out of stock</h2>
          <p className="text-[13px] text-charcoal mb-4">Restock prompts across random categories.</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {lowStock.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="border border-line bg-paper p-2 hover:-translate-y-1 transition group">
                <span className="block aspect-[3/4] overflow-hidden"><ProductImage token={p.images[0]} alt={p.title} className="h-full w-full group-hover:scale-105 transition duration-500" /></span>
                <span className="block text-[13px] font-semibold mt-2 truncate">{p.title}</span>
                <span className="text-[12px] text-burgundy">{p.stockStatus === 'out' ? 'Out of stock' : 'Low stock'}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
