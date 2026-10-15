import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Truck, ShieldCheck, RefreshCcw, BadgeCheck } from 'lucide-react';
import { products } from '../../data/products';
import { collections } from '../../data/collections';
import ProductCard from '../product/ProductCard';
import ProductImage from '../product/ProductImage';
import { storeConfig } from '../../config/store';
import { useState } from 'react';

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return <motion.div initial={{ opacity: 0, y: 26, scale: 0.99 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, delay, type: 'spring', stiffness: 90, damping: 18 }}>{children}</motion.div>;
}

export function TrustMarquee() {
  const items = ['Free delivery over ₹849', 'Assured quality', '7-day returns', 'Made in India', 'COD available', '5 Lakh+ happy customers', 'Festivals Edit 2026', 'Wedding Fabric Edit'];
  return (
    <div className="bg-ink text-paper overflow-hidden marquee-mask py-2.5 border-y border-ink" aria-hidden="true">
      <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
        {[...items, ...items].map((t, i) => (<span key={i} className="text-[12.5px] tracking-[0.14em] uppercase flex items-center gap-10"><span>{t}</span><span className="text-rose">✦</span></span>))}
      </div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="container-x pt-8 lg:pt-14 pb-10 grid lg:grid-cols-2 gap-8 items-center">
      <div className="order-2 lg:order-1">
        <motion.p initial={reduce ? {} : { opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] tracking-[0.24em] uppercase text-burgundy mb-4">New season · The Botanical Edit</motion.p>
        <h1 className="font-serif-d text-[clamp(44px,6vw,84px)] leading-[0.98] font-medium">
          {['Made to inspire.', 'Designed to', 'become yours.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span className="block" initial={reduce ? {} : { y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.08 * i }}>{line}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={reduce ? {} : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="mt-5 text-[16.5px] text-charcoal max-w-md leading-relaxed">{storeConfig.subline}</motion.p>
        <motion.div initial={reduce ? {} : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-7 flex flex-wrap gap-3">
          <motion.span whileHover={reduce ? {} : { scale: 1.04 }} whileTap={reduce ? {} : { scale: 0.96 }} className="inline-block"><Link to="/collections" className="inline-block bg-burgundy text-paper px-7 py-3.5 text-[13px] tracking-[0.14em] uppercase hover:bg-burgundy-deep transition">Explore fabrics</Link></motion.span>
          <motion.span whileHover={reduce ? {} : { scale: 1.04 }} whileTap={reduce ? {} : { scale: 0.96 }} className="inline-block"><Link to="/collections/botanical-edit" className="inline-block border border-ink px-7 py-3.5 text-[13px] tracking-[0.14em] uppercase hover:bg-ink hover:text-paper transition">Discover the collection</Link></motion.span>
        </motion.div>
        <div className="mt-8 flex gap-6 text-[13px] text-charcoal">
          <span className="flex items-center gap-1.5"><Truck size={15} /> Free ship over ₹849</span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={15} /> Assured quality</span>
          <span className="hidden sm:flex items-center gap-1.5"><RefreshCcw size={15} /> 7-day returns</span>
        </div>
      </div>
      <motion.div initial={reduce ? {} : { clipPath: 'inset(8% 6% 8% 6%)', scale: 0.98 }} animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }} transition={{ duration: 0.9 }}
        className="order-1 lg:order-2 relative overflow-hidden aspect-[4/5] max-h-[640px] bg-sand group">
        <ProductImage token="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80" alt="Draped premium printed textile in burgundy floral" eager className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
        <div className="absolute top-4 right-4 animate-floaty bg-paper/92 backdrop-blur px-3.5 py-2 border border-line text-[12px] tracking-[0.14em] uppercase">✦ Festivals Edit 2026</div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-paper/92 backdrop-blur px-4 py-3 border border-line"><p className="text-[11px] tracking-[0.2em] uppercase text-charcoal">Featured</p><p className="font-serif-d text-lg">Gulnar Floral Glazed Cotton</p></div>
          <Link to="/products/gulnar-floral-glazed-cotton" aria-label="Shop featured fabric" className="h-11 w-11 grid place-items-center rounded-full bg-paper border border-line hover:bg-burgundy hover:text-paper hover:border-burgundy transition"><ArrowUpRight size={18} /></Link>
        </div>
      </motion.div>
    </section>
  );
}

export function CategoryShowcase() {
  const cats = [
    { t: 'Cotton', to: '/collections/cotton', art: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', big: true },
    { t: 'Silk', to: '/collections/silk', art: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
    { t: 'Satin', to: '/collections/satin', art: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
    { t: 'Linen', to: '/collections/linen', art: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
    { t: 'Embroidered', to: '/collections/embroidered', art: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80', big: true },
    { t: 'Printed', to: '/collections/printed-floral', art: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80' },
  ];
  return (
    <section className="container-x py-12">
      <Reveal><div className="flex items-end justify-between mb-6"><div><p className="text-[12px] tracking-[0.22em] uppercase text-burgundy">Shop by material</p><h2 className="font-serif-d text-[clamp(30px,3.4vw,46px)]">Category discovery</h2></div><Link to="/collections" className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.1em]">All fabrics <ArrowRight size={15} /></Link></div></Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 auto-rows-[190px] sm:auto-rows-[220px]">
        {cats.map((c, i) => (
          <Reveal key={c.t} delay={i * 0.05}>
            <Link to={c.to} className={`group relative overflow-hidden block h-full ${c.big ? 'col-span-2 lg:row-span-1' : ''}`}>
              <ProductImage token={c.art} alt={`${c.t} fabric`} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-paper"><span className="font-serif-d text-[22px]">{c.t}</span><span className="h-8 w-8 grid place-items-center rounded-full border border-paper/50 transition group-hover:bg-paper group-hover:text-ink"><ArrowRight size={15} /></span></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProductRail({ title, kicker, filter, link }: { title: string; kicker: string; filter: (p: (typeof products)[number]) => boolean; link: string }) {
  const items = products.filter(filter).slice(0, 5);
  return (
    <section className="container-x py-12">
      <Reveal><div className="flex items-end justify-between mb-6"><div><p className="text-[12px] tracking-[0.22em] uppercase text-burgundy">{kicker}</p><h2 className="font-serif-d text-[clamp(30px,3.4vw,46px)]">{title}</h2></div><Link to={link} className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.1em]">View all <ArrowRight size={15} /></Link></div></Reveal>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">{items.map((p, i) => (<ProductCard key={p.id} product={p} eager={i < 2} />))}</div>
    </section>
  );
}

export function PatternShowcase() {
  const pats = [
    { t: 'Floral', to: '/collections/printed-floral', art: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80' },
    { t: 'Geometric', to: '/collections/geometric', art: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
    { t: 'Paisley', to: '/collections/geometric', art: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=800&q=80' },
    { t: 'Checks', to: '/collections/geometric', art: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80' },
    { t: 'Abstract', to: '/collections/satin', art: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' },
    { t: 'Botanical', to: '/collections/botanical-edit', art: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80' },
    { t: 'Traditional', to: '/collections/heritage', art: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80' },
    { t: 'Polka', to: '/collections/geometric', art: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80' },
  ];
  return (
    <section className="bg-sand/60 py-14 mt-6">
      <div className="container-x">
        <Reveal><p className="text-[12px] tracking-[0.22em] uppercase text-burgundy">Shop by pattern</p><h2 className="font-serif-d text-[clamp(30px,3.4vw,46px)] mb-6">Find your print</h2></Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {pats.map((p, i) => (
            <Reveal key={p.t + i} delay={(i % 4) * 0.05}>
              <Link to={p.to} className="group relative overflow-hidden block aspect-square">
                <ProductImage token={p.art} alt={`${p.t} pattern`} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-ink/25 group-hover:bg-ink/40 transition" />
                <span className="absolute inset-x-0 bottom-0 p-3.5 text-paper font-serif-d text-[21px]">{p.t}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EditorialFeature() {
  return (
    <section className="container-x py-16 grid lg:grid-cols-5 gap-8 items-stretch">
      <Reveal><div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px] lg:col-span-3">
        <ProductImage token="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80" alt="The Botanical Edit — tropical crepe" className="absolute inset-0 h-full w-full" />
      </div></Reveal>
      <div className="lg:col-span-2 bg-ink text-paper p-8 lg:p-12 flex flex-col justify-center">
        <Reveal><p className="text-[12px] tracking-[0.22em] uppercase text-rose">Curated collection</p>
        <h2 className="font-serif-d text-[clamp(32px,3.6vw,52px)] leading-tight mt-2">The Botanical Edit</h2>
        <p className="text-paper/75 mt-4 leading-relaxed">Garden greens, monsoon leaves and trailing florals — printed on flowing crepe, georgette and lush satin for pieces that move with you.</p>
        <Link to="/collections/botanical-edit" className="mt-7 inline-flex w-fit items-center gap-2 bg-paper text-ink px-6 py-3 text-[13px] tracking-[0.14em] uppercase hover:bg-rose transition">Shop the edit <ArrowRight size={15} /></Link></Reveal>
      </div>
    </section>
  );
}

export function CraftSection() {
  return (
    <section className="container-x py-14 grid lg:grid-cols-2 gap-10 items-center">
      <Reveal><div>
        <p className="text-[12px] tracking-[0.22em] uppercase text-burgundy">Craft & expression</p>
        <h2 className="font-serif-d text-[clamp(30px,3.4vw,46px)] leading-tight">Fabric is where your ideas take shape</h2>
        <p className="text-charcoal mt-4 leading-relaxed max-w-lg">From everyday cotton to festive sequins, every metre is chosen for hand-feel, drape and print clarity — so makers, boutiques and home sewists can create with confidence.</p>
        <div className="mt-6 flex gap-6 text-[13.5px]">
          <span className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-olive" /> Width & GSM listed</span>
          <span className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-olive" /> Per-meter pricing</span>
        </div>
        <Link to="/about" className="mt-7 inline-flex items-center gap-2 border border-ink px-6 py-3 text-[13px] tracking-[0.14em] uppercase hover:bg-ink hover:text-paper transition">Our story <ArrowRight size={15} /></Link>
      </div></Reveal>
      <Reveal delay={0.1}><div className="grid grid-cols-2 gap-3.5">
        <ProductImage token="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80" alt="Bandhani craft detail" className="aspect-[3/4] w-full" />
        <ProductImage token="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80" alt="Champagne satin drape" className="aspect-[3/4] w-full mt-8" />
      </div></Reveal>
    </section>
  );
}

export function BulkPromo() {
  return (
    <section className="container-x pb-4">
      <Reveal><div className="border border-line bg-paper p-8 lg:p-12 grid lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2"><p className="text-[12px] tracking-[0.22em] uppercase text-burgundy">Boutiques · Designers · Tailors</p>
        <h2 className="font-serif-d text-[clamp(28px,3vw,42px)]">Buying in bulk? Let's talk metres.</h2>
        <p className="text-charcoal mt-2">Share your requirement — fabric, quantity, timeline — and we'll respond with availability and pricing.</p></div>
        <Link to="/bulk-orders" className="justify-self-start lg:justify-self-end bg-ink text-paper px-7 py-3.5 text-[13px] tracking-[0.14em] uppercase hover:bg-burgundy transition">Request bulk quote</Link>
      </div></Reveal>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState(''); const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');
  return (
    <section className="container-x py-14">
      <Reveal><div className="max-w-xl mx-auto text-center">
        <p className="text-[12px] tracking-[0.22em] uppercase text-burgundy">Newsletter</p>
        <h2 className="font-serif-d text-[clamp(28px,3vw,42px)]">First to know, first to sew</h2>
        <p className="text-charcoal mt-2 text-[14.5px]">New prints and restocks, once or twice a month. Demo form — stored locally only.</p>
        {state === 'done' ? <p role="status" className="mt-5 border border-olive text-olive px-5 py-3.5">Thank you — you're on the list (demo).</p> : (
          <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; } try { localStorage.setItem('af-news', email); } catch { /* noop */ } setState('done'); }} noValidate>
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }} placeholder="you@example.com"
              className="flex-1 border border-line bg-paper px-4 py-3 outline-none focus:border-burgundy" aria-invalid={state === 'error'} aria-describedby={state === 'error' ? 'nl-err' : undefined} />
            <button className="bg-burgundy text-paper px-6 text-[13px] tracking-[0.12em] uppercase hover:bg-burgundy-deep transition">Join</button>
          </form>
        )}
        {state === 'error' && <p id="nl-err" role="alert" className="text-burgundy text-[13px] mt-2">Please enter a valid email address.</p>}
      </div></Reveal>
    </section>
  );
}

export function CollectionIndex() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
      {collections.map((c, i) => (
        <Reveal key={c.slug} delay={(i % 3) * 0.05}>
          <Link to={`/collections/${c.slug}`} className="group relative overflow-hidden block aspect-[4/3] bg-sand">
            <ProductImage token={c.image} alt={c.title} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <span className="absolute bottom-3 left-3 right-3 text-paper"><span className="font-serif-d text-[22px] block">{c.title}</span><span className="text-[12.5px] text-paper/80">Explore →</span></span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
