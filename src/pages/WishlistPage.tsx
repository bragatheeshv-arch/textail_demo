import { useEffect } from 'react';
import { Link } from 'react-router';
import { products } from '../data/products';
import { useWishlist, useUI } from '../store/shopStore';
import { useCart } from '../store/cartStore';
import ProductImage from '../components/product/ProductImage';
import { formatINR } from '../lib/currency';

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const showToast = useUI((s) => s.showToast);
  useEffect(() => { document.title = 'Wishlist — ATELIER FABRICS'; }, []);
  const items = products.filter((p) => ids.includes(p.id));
  if (!items.length) return <main className="container-x py-20 text-center"><h1 className="font-serif-d text-4xl mb-2">Wishlist is empty</h1><p className="text-charcoal mb-6">Tap the heart on any product to save it here.</p><Link to="/collections" className="bg-ink text-paper px-7 py-3.5 text-[13px] tracking-[0.12em] uppercase">Discover fabrics</Link></main>;
  return (
    <main className="container-x py-10">
      <h1 className="font-serif-d text-[clamp(32px,4vw,52px)] mb-6">Wishlist ({items.length})</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {items.map((p) => (
          <li key={p.id} className="border border-line bg-paper">
            <Link to={`/products/${p.slug}`} className="block aspect-[3/4] overflow-hidden bg-sand"><ProductImage token={p.images[0]} alt={p.title} className="h-full w-full" /></Link>
            <div className="p-3.5"><Link to={`/products/${p.slug}`} className="font-serif-d text-[18px] leading-snug">{p.title}</Link>
            <p className="font-bold mt-1">{formatINR(p.pricePaise)}</p>
            <div className="flex gap-2 mt-2.5">
              <button onClick={() => { add({ productId: p.id, slug: p.slug, title: p.title, image: p.images[0], unitPricePaise: p.pricePaise, unit: p.unit, qty: 1, material: p.material }); showToast('Moved to cart'); }} className="flex-1 bg-ink text-paper py-2.5 text-[12px] tracking-[0.1em] uppercase">Move to cart</button>
              <button onClick={() => { toggle(p.id); showToast('Removed'); }} aria-label={`Remove ${p.title}`} className="border border-line px-3.5">✕</button>
            </div></div>
          </li>
        ))}
      </ul>
    </main>
  );
}
