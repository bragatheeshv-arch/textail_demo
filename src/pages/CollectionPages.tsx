import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { SlidersHorizontal, X } from 'lucide-react';
import { products, allMaterials, allPatterns, allColors, allCategories, maxPrice } from '../data/products';
import { collections } from '../data/collections';
import { applyFilters, applySort, emptyFilters, type FilterState, type SortKey } from '../lib/filters';
import { formatINR } from '../lib/currency';
import ProductCard from '../components/product/ProductCard';
import { Reveal } from '../components/home/sections';

function collectionPredicate(slug: string | undefined) {
  const c = collections.find((x) => x.slug === slug);
  if (!c) return { title: 'All Fabrics', desc: 'The full demo catalog.', test: (_p: (typeof products)[number]) => true };
  const f = c.filter;
  return {
    title: c.title, desc: c.description,
    test: (p: (typeof products)[number]) =>
      (!f.material || p.material === f.material) && (!f.pattern || p.pattern === f.pattern || p.tags.includes('craft') && f.pattern === 'Traditional') &&
      (!f.category || p.category === f.category) && (!f.color || p.colors.includes(f.color)) &&
      (!f.tag || (f.tag === 'new' ? p.isNew : f.tag === 'sale' ? (p.compareAtPaise && p.compareAtPaise > p.pricePaise) : true)),
  };
}

const SORTS: { v: SortKey; l: string }[] = [
  { v: 'featured', l: 'Featured' }, { v: 'newest', l: 'Newest' }, { v: 'price-asc', l: 'Price: low to high' },
  { v: 'price-desc', l: 'Price: high to low' }, { v: 'name', l: 'Name A–Z' }, { v: 'discount', l: 'Discount' },
];

export function CollectionsPage() {
  useEffect(() => { document.title = 'Collections — ATELIER FABRICS'; }, []);
  return (
    <main className="container-x py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-charcoal mb-3"><Link to="/" className="hover:text-burgundy">Home</Link> / Collections</nav>
      <h1 className="font-serif-d text-[clamp(34px,4vw,58px)]">Collections</h1>
      <p className="text-charcoal mt-1 mb-8">Shop by material, pattern and occasion.</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
        {collections.map((c) => (
          <Link key={c.slug} to={`/collections/${c.slug}`} className="border border-line bg-paper p-5 hover:border-burgundy transition group">
            <p className="font-serif-d text-[22px] group-hover:text-burgundy transition">{c.title}</p>
            <p className="text-[13.5px] text-charcoal mt-1">{c.description}</p>
            <p className="text-[12.5px] font-bold tracking-[0.1em] uppercase mt-3">Explore →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function CollectionPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [visible, setVisible] = useState(12);

  const initial: FilterState = useMemo(() => ({
    ...emptyFilters,
    materials: params.getAll('material'), colors: params.getAll('color'),
    patterns: params.getAll('pattern'), categories: params.getAll('category'),
    saleOnly: params.get('sale') === '1', inStockOnly: params.get('stock') === '1',
    maxPricePaise: params.get('max') ? Number(params.get('max')) : null, query: params.get('q') ?? '',
  }), [params]);
  const [f, setF] = useState<FilterState>(initial);
  const [sort, setSort] = useState<SortKey>((params.get('sort') as SortKey) || 'featured');
  useEffect(() => { setF(initial); }, [initial]);
  useEffect(() => { setVisible(12); }, [slug]);

  const sync = (nf: FilterState, ns: SortKey) => {
    const p = new URLSearchParams();
    nf.materials.forEach((m) => p.append('material', m)); nf.colors.forEach((m) => p.append('color', m));
    nf.patterns.forEach((m) => p.append('pattern', m)); nf.categories.forEach((m) => p.append('category', m));
    if (nf.saleOnly) p.set('sale', '1'); if (nf.inStockOnly) p.set('stock', '1');
    if (nf.maxPricePaise) p.set('max', String(nf.maxPricePaise)); if (ns !== 'featured') p.set('sort', ns);
    setParams(p, { replace: true });
  };
  const upd = (patch: Partial<FilterState>) => { const nf = { ...f, ...patch }; setF(nf); sync(nf, sort); };
  const toggle = (key: 'materials' | 'colors' | 'patterns' | 'categories', v: string) => {
    const arr = f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v];
    upd({ [key]: arr } as Partial<FilterState>);
  };

  const { title, desc, test } = collectionPredicate(slug);
  const base = products.filter(test);
  const filtered = useMemo(() => applySort(applyFilters(base, f), sort), [base, f, sort]);
  useEffect(() => { document.title = `${title} — ATELIER FABRICS`; }, [title]);

  const chips: { label: string; clear: () => void }[] = [
    ...f.materials.map((m) => ({ label: m, clear: () => toggle('materials', m) })),
    ...f.colors.map((m) => ({ label: m, clear: () => toggle('colors', m) })),
    ...f.patterns.map((m) => ({ label: m, clear: () => toggle('patterns', m) })),
    ...f.categories.map((m) => ({ label: m, clear: () => toggle('categories', m) })),
    ...(f.saleOnly ? [{ label: 'On sale', clear: () => upd({ saleOnly: false }) }] : []),
    ...(f.inStockOnly ? [{ label: 'In stock', clear: () => upd({ inStockOnly: false }) }] : []),
    ...(f.maxPricePaise ? [{ label: `Under ${formatINR(f.maxPricePaise)}`, clear: () => upd({ maxPricePaise: null }) }] : []),
  ];

  const panel = (
    <div className="space-y-6">
      <FilterGroup title="Material" options={allMaterials} sel={f.materials} onT={(v) => toggle('materials', v)} />
      <FilterGroup title="Pattern" options={allPatterns} sel={f.patterns} onT={(v) => toggle('patterns', v)} />
      <FilterGroup title="Color" options={allColors} sel={f.colors} onT={(v) => toggle('colors', v)} />
      <FilterGroup title="Category" options={allCategories} sel={f.categories} onT={(v) => toggle('categories', v)} />
      <div><p className="text-[12px] tracking-[0.16em] uppercase text-charcoal mb-2.5">Price</p>
        {[30000, 50000, 80000, 150000].map((m) => (
          <label key={m} className="flex items-center gap-2.5 py-1.5 text-[14px] cursor-pointer">
            <input type="radio" name="maxp" checked={f.maxPricePaise === m} onChange={() => upd({ maxPricePaise: m })} className="accent-[#762e3b]" /> Under {formatINR(m)}
          </label>
        ))}
        {f.maxPricePaise && <button onClick={() => upd({ maxPricePaise: null })} className="text-[13px] underline mt-1">Clear price</button>}
        <p className="text-[12px] text-charcoal mt-1">Max in catalog: {formatINR(maxPrice)}</p>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2.5 text-[14px] cursor-pointer"><input type="checkbox" checked={f.saleOnly} onChange={(e) => upd({ saleOnly: e.target.checked })} className="accent-[#762e3b]" /> On sale</label>
        <label className="flex items-center gap-2.5 text-[14px] cursor-pointer"><input type="checkbox" checked={f.inStockOnly} onChange={(e) => upd({ inStockOnly: e.target.checked })} className="accent-[#762e3b]" /> In stock only</label>
      </div>
    </div>
  );

  return (
    <main className="container-x py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-charcoal mb-3"><Link to="/" className="hover:text-burgundy">Home</Link> / <Link to="/collections" className="hover:text-burgundy">Collections</Link> / {title}</nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif-d text-[clamp(34px,4vw,58px)] leading-none">{title}</h1><p className="text-charcoal mt-2 max-w-xl">{desc}</p></div>
        <p aria-live="polite" className="text-[13.5px] text-charcoal">{filtered.length} product{filtered.length === 1 ? '' : 's'}</p>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-5" aria-label="Active filters">
          {chips.map((c) => (<button key={c.label} onClick={c.clear} className="inline-flex items-center gap-1.5 border border-ink bg-paper px-3 py-1.5 text-[12.5px] hover:border-burgundy transition">{c.label} <X size={13} /></button>))}
          <button onClick={() => { setF(emptyFilters); setSort('featured'); setParams({}); }} className="text-[13px] underline underline-offset-4 ml-1">Clear all</button>
        </div>
      )}
      <div className="flex items-center gap-3 mt-6 mb-5">
        <button onClick={() => setDrawer(true)} className="lg:hidden inline-flex items-center gap-2 border border-line bg-paper px-4 py-2.5 text-[13px] font-semibold"><SlidersHorizontal size={15} /> Filters</button>
        <label className="ml-auto text-[13px] text-charcoal">Sort <select value={sort} onChange={(e) => { const ns = e.target.value as SortKey; setSort(ns); sync(f, ns); }} aria-label="Sort products" className="ml-1 border border-line bg-paper px-3 py-2.5 text-[13.5px] text-ink outline-none">{SORTS.map((s) => (<option key={s.v} value={s.v}>{s.l}</option>))}</select></label>
      </div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block border-r border-line pr-6" aria-label="Filters">{panel}</aside>
        <div>
          {filtered.length === 0 ? (
            <div className="border border-dashed border-line py-20 text-center"><p className="font-serif-d text-3xl mb-2">Nothing matches those filters</p><p className="text-charcoal text-[14px] mb-5">Try removing a filter or two.</p><button onClick={() => { setF(emptyFilters); setParams({}); }} className="bg-ink text-paper px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Reset filters</button></div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">{filtered.slice(0, visible).map((p, i) => (<ProductCard key={p.id} product={p} eager={i < 4} />))}</div>
              {visible < filtered.length && <div className="text-center mt-8"><button onClick={() => setVisible((v) => v + 12)} className="border border-ink px-8 py-3 text-[13px] tracking-[0.12em] uppercase hover:bg-ink hover:text-paper transition">Load more ({filtered.length - visible} left)</button></div>}
            </>
          )}
        </div>
      </div>
      {drawer && (
        <div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink/45" onClick={() => setDrawer(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] bg-paper rounded-t-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-line"><p className="font-semibold">Filters</p><button onClick={() => setDrawer(false)} aria-label="Close filters" className="p-2"><X size={19} /></button></div>
            <div className="p-5 overflow-y-auto">{panel}</div>
            <div className="p-4 border-t border-line sticky bottom-0 bg-paper"><button onClick={() => setDrawer(false)} className="w-full bg-burgundy text-paper py-3.5 text-[13px] tracking-[0.12em] uppercase">Show {filtered.length} results</button></div>
          </div>
        </div>
      )}
      <Reveal><p className="sr-only">End of results</p></Reveal>
    </main>
  );
}

function FilterGroup({ title, options, sel, onT }: { title: string; options: string[]; sel: string[]; onT: (v: string) => void }) {
  return (
    <div><p className="text-[12px] tracking-[0.16em] uppercase text-charcoal mb-2.5">{title}</p>
      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
        {options.map((o) => (<label key={o} className="flex items-center gap-2.5 py-1 text-[14px] cursor-pointer"><input type="checkbox" checked={sel.includes(o)} onChange={() => onT(o)} className="accent-[#762e3b] h-4 w-4" /> {o}</label>))}
      </div>
    </div>
  );
}
