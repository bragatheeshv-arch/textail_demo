import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { products } from '../../data/products';
import { searchProducts } from '../../lib/filters';
import { formatINR } from '../../lib/currency';
import { useUI } from '../../store/shopStore';
import ProductImage from '../product/ProductImage';

export default function SearchDialog() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchProducts(products, q, 8);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open ]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/45" onClick={() => setOpen(false)} />
          <motion.div initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.25 }}
            className="absolute top-0 left-0 right-0 bg-paper border-b border-line">
            <div className="container-x py-6">
              <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
                <SearchIcon size={20} />
                <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
                  placeholder="Search fabrics, silk, floral, saree…" aria-label="Search products"
                  className="flex-1 bg-transparent outline-none text-lg placeholder:text-charcoal/60"
                  onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) { setOpen(false); window.location.hash = ''; window.location.href = `/search?q=${encodeURIComponent(q.trim())}`; } }} />
                <button onClick={() => setOpen(false)} aria-label="Close search" className="p-2"><X size={20} /></button>
              </div>
              {q.trim() === '' ? (
                <div className="py-5 flex flex-wrap gap-2">
                  {['floral', 'cotton', 'satin', 'saree', 'velvet', 'checks'].map((t) => (
                    <button key={t} onClick={() => setQ(t)} className="border border-line px-4 py-2 text-[13px] hover:border-burgundy transition">{t}</button>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="py-8 text-center text-charcoal">No matches for “{q}”. Try “cotton”, “floral” or “saree”.</p>
              ) : (
                <ul className="py-4 divide-y divide-line max-h-[50vh] overflow-y-auto">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <Link to={`/products/${p.slug}`} onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 py-2.5 px-2 ${i === active ? 'bg-ivory' : ''}`}>
                        <span className="h-[52px] w-[42px] overflow-hidden border border-line shrink-0"><ProductImage token={p.images[0]} alt={p.title} className="h-full w-full" /></span>
                        <span className="flex-1"><span className="block font-semibold text-[14px]">{p.title}</span>
                        <span className="text-[12.5px] text-charcoal">{p.material} · {p.pattern}</span></span>
                        <span className="font-bold text-[14px]">{formatINR(p.pricePaise)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {q.trim() && (
                <Link to={`/search?q=${encodeURIComponent(q.trim())}`} onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 pb-5 text-[13px] font-bold tracking-[0.1em] uppercase text-burgundy">See all results <ArrowRight size={15} /></Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
