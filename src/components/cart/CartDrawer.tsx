import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../../store/cartStore';
import { useUI } from '../../store/shopStore';
import { formatINR, lineTotal } from '../../lib/currency';
import { storeConfig } from '../../config/store';
import ProductImage from '../product/ProductImage';

function useLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') useUI.getState().setCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open ]);
}

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const summary = useCart((s) => s.summary)();
  const nav = useNavigate();
  useLock(open);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/45" onClick={() => setOpen(false)} />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.32 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-paper flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <p className="font-serif-d text-xl">Cart ({lines.length})</p>
              <button onClick={() => setOpen(false)} aria-label="Close cart" className="p-2"><X size={20} /></button>
            </div>
            {lines.length === 0 ? (
              <div className="flex-1 grid place-items-center p-8 text-center">
                <div><p className="font-serif-d text-2xl mb-2">Your cart is empty</p>
                <p className="text-sm text-charcoal mb-5">Beautiful fabrics are waiting.</p>
                <button onClick={() => { setOpen(false); nav('/collections'); }} className="bg-burgundy text-paper px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Continue shopping</button></div>
              </div>
            ) : (
              <>
                <div className="px-5 py-3 border-b border-line">
                  <p className="text-[12.5px] text-charcoal mb-1.5">{summary.shippingPaise === 0 ? 'You unlocked free shipping' : `${formatINR(storeConfig.freeShippingThresholdPaise - summary.subtotalPaise)} away from free shipping`}</p>
                  <div className="h-1.5 bg-sand rounded-full overflow-hidden"><div className="h-full bg-burgundy transition-all" style={{ width: `${Math.round(summary.freeShipProgress * 100)}%` }} /></div>
                </div>
                <ul className="flex-1 overflow-y-auto divide-y divide-line">
                  {lines.map((l) => (
                    <motion.li key={l.productId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3 p-4">
                      <Link to={`/products/${l.slug}`} onClick={() => setOpen(false)} className="w-16 h-20 shrink-0 overflow-hidden border border-line">
                        <ProductImage token={l.image} alt={l.title} className="h-full w-full" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${l.slug}`} onClick={() => setOpen(false)} className="font-semibold text-[14px] clamp2">{l.title}</Link>
                        <p className="text-[12.5px] text-charcoal">{formatINR(l.unitPricePaise)} / {l.unit === 'meter' ? 'meter' : 'piece'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-line">
                            <button aria-label="Decrease quantity" className="p-1.5" onClick={() => setQty(l.productId, +(l.qty - (l.unit === 'meter' ? 0.5 : 1)).toFixed(2))}><Minus size={14} /></button>
                            <span className="min-w-12 text-center text-[13px] font-semibold">{l.qty} {l.unit === 'meter' ? 'm' : ''}</span>
                            <button aria-label="Increase quantity" className="p-1.5" onClick={() => setQty(l.productId, +(l.qty + (l.unit === 'meter' ? 0.5 : 1)).toFixed(2))}><Plus size={14} /></button>
                          </div>
                          <button aria-label={`Remove ${l.title}`} onClick={() => remove(l.productId)} className="p-1.5 text-charcoal hover:text-burgundy"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <p className="font-bold text-[14px]">{formatINR(lineTotal(l.unitPricePaise, l.qty))}</p>
                    </motion.li>
                  ))}
                </ul>
                <div className="border-t border-line p-5 space-y-1.5">
                  <div className="flex justify-between text-[14px]"><span className="text-charcoal">Subtotal</span><span className="font-bold">{formatINR(summary.subtotalPaise)}</span></div>
                  <div className="flex justify-between text-[14px]"><span className="text-charcoal">Shipping</span><span>{summary.shippingPaise === 0 ? 'Free' : formatINR(summary.shippingPaise)}</span></div>
                  <div className="flex justify-between text-[16px] pt-1"><span className="font-semibold">Total</span><span className="font-bold">{formatINR(summary.totalPaise)}</span></div>
                  <button onClick={() => { setOpen(false); nav('/checkout'); }} className="w-full mt-3 bg-burgundy text-paper py-3.5 text-[13px] tracking-[0.14em] uppercase flex items-center justify-center gap-2 hover:bg-burgundy-deep transition">Checkout <ArrowRight size={16} /></button>
                  <button onClick={() => { setOpen(false); nav('/cart'); }} className="w-full py-2.5 text-[13px] underline underline-offset-4">View full cart</button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
