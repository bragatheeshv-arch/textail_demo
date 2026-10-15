import { Link } from 'react-router';
import { Heart, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../../types/product';
import { discountPct, formatINR } from '../../lib/currency';
import { useWishlist, useUI } from '../../store/shopStore';
import { useCart } from '../../store/cartStore';
import ProductImage from './ProductImage';

export default function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const wished = useWishlist((s) => s.has(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const showToast = useUI((s) => s.showToast);
  const pct = discountPct(product.pricePaise, product.compareAtPaise);

  const quickAdd = () => {
    if (product.stockStatus === 'out') { showToast('Out of stock in demo'); return; }
    add({ productId: product.id, slug: product.slug, title: product.title, image: product.images[0], unitPricePaise: product.pricePaise, unit: product.unit, qty: product.unit === 'piece' ? 1 : 1, material: product.material });
    setCartOpen(true);
  };

  return (
    <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
      className="group flex flex-col bg-paper border border-line overflow-hidden hover:shadow-[0_18px_50px_-20px_rgba(36,33,31,0.35)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden aspect-[3/4] bg-sand">
        <Link to={`/products/${product.slug}`} aria-label={product.title} className="block h-full">
          <ProductImage token={product.images[0]} alt={product.title} eager={eager}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.05]" />
        </Link>
        <div className="absolute top-2 left-2 z-10 flex gap-1.5">
          {product.isNew && <span className="bg-ink text-paper text-[10px] tracking-[0.14em] px-2 py-1">NEW</span>}
          {pct && <span className="bg-burgundy text-paper text-[10px] tracking-[0.14em] px-2 py-1">-{pct}%</span>}
          {product.stockStatus === 'out' && <span className="bg-charcoal text-paper text-[10px] tracking-[0.14em] px-2 py-1">SOLD OUT</span>}
        </div>
        <button onClick={() => { toggle(product.id); showToast(wished ? 'Removed from wishlist' : 'Saved to wishlist'); }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished}
          className="absolute top-2 right-2 z-10 h-9 w-9 grid place-items-center rounded-full bg-paper/90 backdrop-blur border border-line hover:border-burgundy transition">
          <Heart size={16} className={wished ? 'fill-burgundy text-burgundy' : 'text-ink'} />
        </button>
        {/* Hover details sheet — slides up on cursor-over / keyboard focus */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="bg-ink/88 text-paper backdrop-blur px-3.5 pt-3 pb-3 text-left">
            <p className="text-[10.5px] tracking-[0.16em] uppercase text-paper/70">{product.material} · {product.pattern} · {product.unit === 'meter' ? `${product.widthInch}" wide` : 'per piece'}</p>
            <p className="font-serif-d text-[16px] leading-snug mt-0.5 clamp2">{product.title}</p>
            <p className="text-[12.5px] text-paper/75 mt-1 clamp2">{product.composition}{product.colors.length > 0 && ` · ${product.colors.slice(0, 3).join(', ')}`}</p>
            <p className="mt-1.5 flex items-center gap-2 text-[13px]">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${product.stockStatus === 'out' ? 'bg-rose' : product.stockStatus === 'low' ? 'bg-burgundy' : 'bg-olive'}`} />
              {product.stockStatus === 'out' ? 'Out of stock' : product.stockStatus === 'low' ? 'Low stock — order soon' : 'In stock'}
              <span className="ml-auto font-bold">{formatINR(product.pricePaise)}{product.unit === 'meter' ? ' /m' : ''}</span>
            </p>
          </div>
        </div>
        <Link to={`/products/${product.slug}`} aria-label={`View details of ${product.title}`}
          className="absolute inset-x-0 bottom-0 h-[46%] opacity-0 focus:opacity-100" tabIndex={-1} />
        <button onClick={quickAdd} disabled={product.stockStatus === 'out'}
          className="absolute bottom-2 right-2 z-10 h-9 w-9 grid place-items-center rounded-full bg-paper text-ink opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0 transition disabled:opacity-40"
          aria-label={`Quick add ${product.title}`}>
          <Plus size={16} />
        </button>
      </div>
      <div className="p-3.5 flex flex-col gap-1 grow">
        <p className="text-[11px] tracking-[0.16em] uppercase text-charcoal">{product.material} · {product.pattern}</p>
        <Link to={`/products/${product.slug}`} className="font-serif-d text-[19px] leading-snug clamp2 hover:text-burgundy transition">{product.title}</Link>
        <p className="text-[13px] text-charcoal">{product.stockStatus === 'out' ? 'Out of stock' : product.stockStatus === 'low' ? 'Low stock' : 'In stock'} {product.unit === 'meter' ? '· /meter' : '· per piece'}</p>
        <p className="mt-auto pt-1 flex items-baseline gap-2">
          <span className="font-bold">{formatINR(product.pricePaise)}</span>
          {product.compareAtPaise && <span className="text-[13px] text-charcoal line-through">{formatINR(product.compareAtPaise)}</span>}
        </p>
      </div>
    </motion.article>
  );
}
