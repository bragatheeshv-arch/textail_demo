import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { products } from '../data/products';
import { applyFilters, emptyFilters } from '../lib/filters';
import ProductCard from '../components/product/ProductCard';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const [input, setInput] = useState(q);
  useEffect(() => { setInput(q); }, [q]);
  useEffect(() => { document.title = q ? `Search: ${q} — ATELIER FABRICS` : 'Search — ATELIER FABRICS'; }, [q]);
  const results = useMemo(() => applyFilters(products, { ...emptyFilters, query: q }), [q]);
  return (
    <main className="container-x py-10">
      <h1 className="font-serif-d text-[clamp(32px,4vw,54px)]">Search</h1>
      <form action="/search" method="get" className="mt-4 flex gap-2 max-w-xl">
        <label htmlFor="sq" className="sr-only">Search products</label>
        <input id="sq" name="q" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Try cotton, floral, saree…" className="flex-1 border border-line bg-paper px-4 py-3 outline-none focus:border-burgundy" />
        <button className="bg-ink text-paper px-6 text-[13px] tracking-[0.12em] uppercase">Search</button>
      </form>
      {q && <p className="mt-4 text-charcoal text-[14px]" aria-live="polite">{results.length} result{results.length === 1 ? '' : 's'} for “{q}”</p>}
      {q && results.length === 0 ? (
        <div className="border border-dashed border-line py-16 text-center mt-6"><p className="font-serif-d text-2xl mb-2">No results found</p><p className="text-charcoal text-sm mb-5">Try a material, pattern or category.</p><Link to="/collections" className="bg-ink text-paper px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Browse collections</Link></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6">{results.slice(0, 24).map((p) => (<ProductCard key={p.id} product={p} />))}</div>
      )}
    </main>
  );
}
