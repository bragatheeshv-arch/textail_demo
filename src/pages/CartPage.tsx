import { useEffect } from 'react';
import { Link } from 'react-router';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../store/cartStore';
import { formatINR, lineTotal } from '../lib/currency';
import ProductImage from '../components/product/ProductImage';

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const summary = useCart((s) => s.summary)();
  useEffect(() => { document.title = 'Cart — ATELIER FABRICS'; }, []);
  if (lines.length === 0) return <main className="container-x py-20 text-center"><h1 className="font-serif-d text-4xl mb-2">Your cart is empty</h1><p className="text-charcoal mb-6">Beautiful fabrics are waiting.</p><Link to="/collections" className="bg-burgundy text-paper px-7 py-3.5 text-[13px] tracking-[0.12em] uppercase">Continue shopping</Link></main>;
  return (
    <main className="container-x py-10 grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <h1 className="font-serif-d text-[clamp(32px,4vw,52px)] mb-5">Cart ({lines.length})</h1>
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((l) => (
            <li key={l.productId} className="flex gap-4 py-4">
              <Link to={`/products/${l.slug}`} className="w-20 h-24 shrink-0 border border-line overflow-hidden"><ProductImage token={l.image} alt={l.title} className="h-full w-full" /></Link>
              <div className="flex-1">
                <Link to={`/products/${l.slug}`} className="font-semibold">{l.title}</Link>
                <p className="text-[13px] text-charcoal">{formatINR(l.unitPricePaise)} / {l.unit}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-line">
                    <button aria-label="Decrease" className="p-2" onClick={() => setQty(l.productId, +(l.qty - 0.5).toFixed(2))}><Minus size={14} /></button>
                    <span className="min-w-12 text-center text-sm font-bold">{l.qty}</span>
                    <button aria-label="Increase" className="p-2" onClick={() => setQty(l.productId, +(l.qty + 0.5).toFixed(2))}><Plus size={14} /></button>
                  </div>
                  <button aria-label={`Remove ${l.title}`} onClick={() => remove(l.productId)} className="p-2 text-charcoal hover:text-burgundy"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="font-bold">{formatINR(lineTotal(l.unitPricePaise, l.qty))}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="border border-line bg-paper p-6 h-fit lg:sticky lg:top-24">
        <h2 className="font-serif-d text-2xl mb-4">Summary</h2>
        <div className="space-y-1.5 text-[14px]"><div className="flex justify-between"><span className="text-charcoal">Subtotal</span><span className="font-bold">{formatINR(summary.subtotalPaise)}</span></div>
        <div className="flex justify-between"><span className="text-charcoal">Shipping</span><span>{summary.shippingPaise === 0 ? 'Free' : formatINR(summary.shippingPaise)}</span></div>
        <div className="flex justify-between text-[16px] pt-2 border-t border-line mt-2"><span className="font-semibold">Total</span><span className="font-bold">{formatINR(summary.totalPaise)}</span></div></div>
        <Link to="/checkout" className="block text-center mt-5 bg-burgundy text-paper py-3.5 text-[13px] tracking-[0.14em] uppercase">Proceed to checkout</Link>
        <Link to="/collections" className="block text-center mt-2 py-2.5 text-[13px] underline underline-offset-4">Continue shopping</Link>
      </aside>
    </main>
  );
}
