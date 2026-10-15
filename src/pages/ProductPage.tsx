import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, Minus, Plus, ShoppingBag, Ruler, ChevronDown } from 'lucide-react';
import { productBySlug, products } from '../data/products';
import { discountPct, formatINR, lineTotal } from '../lib/currency';
import { useCart } from '../store/cartStore';
import { useWishlist, useUI } from '../store/shopStore';
import ProductImage from '../components/product/ProductImage';
import ProductCard from '../components/product/ProductCard';

const GARMENTS = [
  { t: 'Kurta', base44: 2.5, base58: 2.0 }, { t: 'Shirt', base44: 2.0, base58: 1.6 },
  { t: 'Dress', base44: 3.0, base58: 2.5 }, { t: 'Skirt', base44: 2.0, base58: 1.5 },
  { t: 'Trousers', base44: 2.0, base58: 1.5 }, { t: 'Blouse', base44: 1.0, base58: 0.8 },
] as const;

function Estimator({ price, width, onUse, unit }: { price: number; width: number; unit: string; onUse: (q: number) => void }) {
  const [g, setG] = useState<(typeof GARMENTS)[number]>(GARMENTS[0]);
  const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const mult = size === 'S' ? 0.95 : size === 'L' ? 1.1 : size === 'XL' ? 1.2 : 1;
  const wide = width >= 58;
  const est = Math.ceil(((wide ? g.base58 : g.base44) * mult) * 2) / 2;
  if (unit !== 'meter') return null;
  return (
    <div className="border border-line bg-ivory p-5 mt-5">
      <p className="flex items-center gap-2 font-semibold text-[15px]"><Ruler size={16} /> Fabric estimator <span className="text-[11px] font-normal text-charcoal border border-line px-1.5 py-0.5">APPROXIMATE</span></p>
      <p className="text-[12.5px] text-charcoal mt-1">Guidance only — tailoring varies. You can adjust quantity freely.</p>
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <label className="text-[12.5px]">Garment<select value={g.t} onChange={(e) => setG(GARMENTS.find((x) => x.t === e.target.value) ?? GARMENTS[0])} className="mt-1 w-full border border-line bg-paper px-2.5 py-2">{GARMENTS.map((x) => (<option key={x.t}>{x.t}</option>))}</select></label>
        <label className="text-[12.5px]">Size<select value={size} onChange={(e) => setSize(e.target.value as typeof size)} className="mt-1 w-full border border-line bg-paper px-2.5 py-2">{['S','M','L','XL'].map((s) => (<option key={s}>{s}</option>))}</select></label>
      </div>
      <p className="mt-3 text-[14px]">Estimate: <strong>{est} m</strong> · <strong>{formatINR(lineTotal(price, est))}</strong> ({width}" width)</p>
      <button onClick={() => onUse(est)} className="mt-3 w-full border border-ink py-2.5 text-[13px] tracking-[0.1em] uppercase hover:bg-ink hover:text-paper transition">Use {est} m</button>
    </div>
  );
}

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = productBySlug(slug);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState<string | null>('details');
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const wished = useWishlist((s) => (product ? s.has(product.id) : false));
  const toggle = useWishlist((s) => s.toggle);
  const showToast = useUI((s) => s.showToast);

  useEffect(() => { setImg(0); setQty(1); }, [slug]);
  useEffect(() => { document.title = product ? `${product.title} — ATELIER FABRICS` : 'Not found — ATELIER FABRICS'; }, [product]);

  const related = useMemo(() => product ? products.filter((x) => x.id !== product.id && (x.material === product.material || x.pattern === product.pattern)).slice(0, 4) : [], [product]);
  if (!product) return <main className="container-x py-20 text-center"><h1 className="font-serif-d text-4xl mb-3">Product not found</h1><Link to="/collections" className="underline">Back to collections</Link></main>;

  const pct = discountPct(product.pricePaise, product.compareAtPaise);
  const step = product.stepQty;
  const clampQty = (v: number) => Math.min(product.maxQty, Math.max(product.minQty, Math.round(v * 2) / 2));
  const doAdd = (open = true) => {
    if (product.stockStatus === 'out') { showToast('Out of stock in demo'); return; }
    add({ productId: product.id, slug: product.slug, title: product.title, image: product.images[0], unitPricePaise: product.pricePaise, unit: product.unit, qty, material: product.material });
    if (open) setCartOpen(true); else showToast('Added to cart');
  };

  return (
    <main className="container-x py-8">
      <nav aria-label="Breadcrumb" className="text-[13px] text-charcoal mb-5"><Link to="/" className="hover:text-burgundy">Home</Link> / <Link to="/collections" className="hover:text-burgundy">Fabrics</Link> / {product.title}</nav>
      <div className="grid lg:grid-cols-[58%_1fr] gap-10">
        <div>
          <div className="relative overflow-hidden border border-line bg-sand aspect-[3/4] max-h-[720px]">
            <ProductImage token={product.images[img] ?? product.images[0]} alt={product.title} eager className="h-full w-full" />
            <div className="absolute top-3 left-3 flex gap-1.5">{product.isNew && <span className="bg-ink text-paper text-[10px] tracking-[0.14em] px-2 py-1">NEW</span>}{pct && <span className="bg-burgundy text-paper text-[10px] tracking-[0.14em] px-2 py-1">-{pct}%</span>}</div>
          </div>
          <div className="flex gap-2.5 mt-3" role="tablist" aria-label="Product images">
            {product.images.map((t, i) => (
              <button key={i} role="tab" aria-selected={img === i} aria-label={`View image ${i + 1}`} onClick={() => setImg(i)}
                className={`w-20 h-24 overflow-hidden border ${img === i ? 'border-burgundy' : 'border-line'}`}>
                <ProductImage token={t} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[12px] tracking-[0.2em] uppercase text-burgundy">{product.material} · {product.pattern}</p>
          <h1 className="font-serif-d text-[clamp(30px,3.4vw,48px)] leading-tight mt-1">{product.title}</h1>
          <p className="text-[13px] text-charcoal mt-1.5">SKU {product.sku} · {product.stockStatus === 'out' ? 'Out of stock' : product.stockStatus === 'low' ? 'Low stock' : 'In stock'}</p>
          <p className="mt-3 flex items-baseline gap-2.5"><span className="text-[26px] font-bold">{formatINR(product.pricePaise)}</span>
            {product.compareAtPaise && <span className="text-charcoal line-through">{formatINR(product.compareAtPaise)}</span>}
            <span className="text-[13px] text-charcoal">/ {product.unit === 'meter' ? 'meter' : 'piece'}</span></p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/85">{product.description}</p>
          <div className="mt-6">
            <label id="qty-label" className="text-[12px] tracking-[0.16em] uppercase text-charcoal">Quantity {product.unit === 'meter' ? '(meters)' : ''}</label>
            <div className="flex items-stretch gap-2.5 mt-2" role="group" aria-labelledby="qty-label">
              <div className="flex items-center border border-line">
                <button aria-label="Decrease quantity" onClick={() => setQty((q) => clampQty(q - step))} className="px-3.5 py-3 hover:bg-ivory"><Minus size={15} /></button>
                <input aria-label="Quantity" inputMode="decimal" value={qty} onChange={(e) => { const v = Number(e.target.value); if (!Number.isNaN(v)) setQty(clampQty(v)); }} className="w-16 text-center font-bold outline-none" />
                <button aria-label="Increase quantity" onClick={() => setQty((q) => clampQty(q + step))} className="px-3.5 py-3 hover:bg-ivory"><Plus size={15} /></button>
              </div>
              <button onClick={() => toggle(product.id)} aria-pressed={wished} aria-label="Toggle wishlist" className="border border-line px-4 hover:border-burgundy"><Heart size={17} className={wished ? 'fill-burgundy text-burgundy' : ''} /></button>
            </div>
            <p className="text-[13px] text-charcoal mt-1.5">Min {product.minQty} · Max {product.maxQty} · Step {step} {product.unit === 'meter' ? 'm' : ''} · Line total <strong className="text-ink">{formatINR(lineTotal(product.pricePaise, qty))}</strong></p>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
              <button onClick={() => doAdd(true)} disabled={product.stockStatus === 'out'} className="flex-1 bg-burgundy text-paper py-4 text-[13px] tracking-[0.14em] uppercase flex items-center justify-center gap-2 hover:bg-burgundy-deep transition disabled:opacity-40"><ShoppingBag size={16} /> Add to cart</button>
              <Link to="/checkout" onClick={() => doAdd(false)} className="flex-1 border border-ink py-4 text-center text-[13px] tracking-[0.14em] uppercase hover:bg-ink hover:text-paper transition">Buy now</Link>
            </div>
          </div>
          <Estimator price={product.pricePaise} width={product.widthInch} unit={product.unit} onUse={(q) => setQty(clampQty(q))} />
          <div className="mt-6 divide-y divide-line border-y border-line">
            {[
              { id: 'details', t: 'Specifications', body: (<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13.5px]">{product.specs.map((s) => (<div key={s.label}><dt className="text-charcoal">{s.label}</dt><dd className="font-semibold">{s.value}</dd></div>))}{product.gsm ? <div><dt className="text-charcoal">GSM</dt><dd className="font-semibold">{product.gsm}</dd></div> : null}</dl>) },
              { id: 'care', t: 'Care instructions', body: (<ul className="list-disc pl-5 text-[13.5px] space-y-1">{product.care.map((c) => (<li key={c}>{c}</li>))}</ul>) },
              { id: 'ship', t: 'Shipping & returns', body: (<p className="text-[13.5px] text-charcoal">Free shipping over ₹849 · 7-day returns on uncut fabrics in original condition. Demo policy — final terms at checkout.</p>) },
            ].map((a) => (
              <div key={a.id}>
                <button onClick={() => setOpenAcc(openAcc === a.id ? null : a.id)} aria-expanded={openAcc === a.id} className="w-full flex items-center justify-between py-4 text-[14px] font-semibold">{a.t}<ChevronDown size={16} className={openAcc === a.id ? 'rotate-180 transition' : 'transition'} /></button>
                {openAcc === a.id && <div className="pb-5">{a.body}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="mt-16"><h2 className="font-serif-d text-[30px] mb-5">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">{related.map((p) => (<ProductCard key={p.id} product={p} />))}</div></section>
    </main>
  );
}
