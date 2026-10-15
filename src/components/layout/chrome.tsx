import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { navigation, type NavEntry } from '../../data/collections';
import { useEffect, useState } from 'react';
import { useUI } from '../../store/shopStore';
import { useCart } from '../../store/cartStore';
import { Search, Heart, User, ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { storeConfig } from '../../config/store';

function Mega({ entry }: { entry: NavEntry }) {
  if (!entry.mega) return null;
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-40">
      <div className="bg-paper border border-line shadow-[0_30px_60px_-30px_rgba(36,33,31,0.4)] p-7 grid grid-cols-3 gap-8 min-w-[560px]">
        {entry.mega.columns.map((c) => (
          <div key={c.heading}>
            <p className="text-[11px] tracking-[0.18em] uppercase text-charcoal mb-3">{c.heading}</p>
            <ul className="space-y-2">
              {c.links.map((l) => (<li key={l.label}><Link to={l.to} className="text-[14px] hover:text-burgundy transition">{l.label}</Link></li>))}
            </ul>
          </div>
        ))}
        {entry.mega.feature && (
          <Link to={entry.mega.feature.to} className="col-span-3 mt-1 flex items-center justify-between bg-ivory border border-line px-4 py-3 hover:border-burgundy transition">
            <span><span className="font-serif-d text-lg block">{entry.mega.feature.title}</span><span className="text-[13px] text-charcoal">{entry.mega.feature.copy}</span></span>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const msgs = storeConfig.announcements;
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % msgs.length), 3800);
    return () => window.clearInterval(t);
  }, [msgs.length]);
  return (
    <div className="bg-ink text-paper text-center text-[12px] tracking-[0.08em] py-2 px-4 overflow-hidden">
      <button onClick={() => setI((i + 1) % msgs.length)} className="hover:opacity-80 transition animate-pulse" aria-label="Next announcement" key={i}>{msgs[i]}</button>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const openSearch = useUI((s) => s.setSearchOpen);
  const openMobile = useUI((s) => s.setMobileNavOpen);
  const openCart = useUI((s) => s.setCartOpen);
  const cartCount = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-line transition-shadow ${scrolled ? 'shadow-[0_10px_30px_-20px_rgba(36,33,31,0.4)]' : ''}`}>
      <div className="container-x flex items-center gap-4 h-16">
        <button className="lg:hidden p-2 -ml-2" aria-label="Open menu" onClick={() => openMobile(true)}><Menu size={20} /></button>
        <Link to="/" className="font-serif-d text-[22px] tracking-[0.12em] font-semibold">ATELIER <span className="text-burgundy">FABRICS</span></Link>
        <nav className="hidden lg:flex items-center gap-6 mx-auto" aria-label="Primary">
          {navigation.map((n) => (
            <div key={n.label} className="relative group">
              <Link to={n.to} className="text-[13.5px] font-semibold tracking-[0.06em] uppercase py-5 inline-block hover:text-burgundy transition">{n.label}</Link>
              <span className="absolute bottom-3 left-0 h-px w-0 bg-burgundy group-hover:w-full transition-all" />
              <Mega entry={n} />
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-1 ml-auto">
          <a href={`tel:${storeConfig.supportPhone.replace(/\s/g, '')}`} className="hidden xl:flex items-center gap-1.5 text-[13px] mr-2 text-charcoal" aria-label="Call us"><Phone size={15} />{storeConfig.supportPhone}</a>
          <button onClick={() => openSearch(true)} aria-label="Search" className="p-2.5 hover:text-burgundy transition"><Search size={19} /></button>
          <Link to="/account" aria-label="Account" className="p-2.5 hover:text-burgundy transition hidden sm:block"><User size={19} /></Link>
          <Link to="/wishlist" aria-label="Wishlist" className="p-2.5 hover:text-burgundy transition hidden sm:block"><Heart size={19} /></Link>
          <button onClick={() => openCart(true)} aria-label={`Open cart, ${cartCount} items`} className="p-2.5 hover:text-burgundy transition relative">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="absolute top-0.5 right-0 bg-burgundy text-paper text-[10px] min-w-4 h-4 px-0.5 grid place-items-center rounded-full">{cartCount > 99 ? '99+' : Math.round(cartCount)}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const open = useUI((s) => s.mobileNavOpen);
  const set = useUI((s) => s.setMobileNavOpen);
  const [exp, setExp] = useState<string | null>(null);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-ink/40" onClick={() => set(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-paper p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="font-serif-d text-xl">ATELIER FABRICS</span>
          <button onClick={() => set(false)} aria-label="Close menu" className="p-2"><X size={20} /></button>
        </div>
        {navigation.map((n) => (
          <div key={n.label} className="border-b border-line">
            <div className="flex items-center">
              <Link to={n.to} onClick={() => set(false)} className="flex-1 py-3.5 font-semibold text-[15px]">{n.label}</Link>
              {n.mega && <button aria-label={`Expand ${n.label}`} onClick={() => setExp(exp === n.label ? null : n.label)} className="p-3">{exp === n.label ? '−' : '+'}</button>}
            </div>
            {n.mega && exp === n.label && (
              <div className="pb-4 pl-1 space-y-3">
                {n.mega.columns.map((c) => (
                  <div key={c.heading}><p className="text-[11px] uppercase tracking-[0.16em] text-charcoal mb-1.5">{c.heading}</p>
                    {c.links.map((l) => (<Link key={l.label} to={l.to} onClick={() => set(false)} className="block py-1.5 text-[14px]">{l.label}</Link>))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-5">
          <Link to="/account" onClick={() => set(false)} className="flex-1 border border-line py-3 text-center text-sm font-semibold">Account</Link>
          <Link to="/wishlist" onClick={() => set(false)} className="flex-1 border border-line py-3 text-center text-sm font-semibold">Wishlist</Link>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper mt-20">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-serif-d text-2xl tracking-[0.1em]">ATELIER FABRICS</p>
          <p className="text-[14px] text-paper/70 mt-3 max-w-xs">Expressive prints, considered textures, and beautiful fabrics for your next creation.</p>
          <p className="text-[13px] text-paper/60 mt-4">{storeConfig.address}<br />{storeConfig.supportEmail}<br />{storeConfig.supportPhone}</p>
        </div>
        <nav aria-label="Shop"><p className="text-[12px] tracking-[0.18em] uppercase text-paper/60 mb-4">Shop</p>
          {[['New Arrivals','/collections/new-arrivals'],['Cotton','/collections/cotton'],['Silk','/collections/silk'],['Sarees','/collections/sarees'],['Sale','/collections/sale'],['All Collections','/collections']].map(([l,to]) => (<Link key={to+l} to={to} className="block py-1.5 text-[14px] text-paper/85 hover:text-paper">{l}</Link>))}
        </nav>
        <nav aria-label="Help"><p className="text-[12px] tracking-[0.18em] uppercase text-paper/60 mb-4">Customer care</p>
          {[['About','/about'],['Contact','/contact'],['Bulk Orders','/bulk-orders'],['FAQ','/faq'],['Shipping','/policies/shipping'],['Returns','/policies/returns'],['Privacy','/policies/privacy'],['Terms','/policies/terms']].map(([l,to]) => (<Link key={to} to={to} className="block py-1.5 text-[14px] text-paper/85 hover:text-paper">{l}</Link>))}
        </nav>
        <div>
          <p className="text-[12px] tracking-[0.18em] uppercase text-paper/60 mb-4">Visit</p>
          <p className="text-[14px] text-paper/85">Cart · Wishlist · Account · Search are fully navigable demo flows.</p>
          <Link to="/bulk-orders" className="inline-block mt-4 border border-paper/40 px-5 py-2.5 text-[13px] tracking-[0.1em] uppercase hover:bg-paper hover:text-ink transition">Bulk inquiry</Link>
        </div>
      </div>
      <div className="border-t border-paper/15"><div className="container-x py-5 flex flex-col sm:flex-row gap-2 justify-between text-[12.5px] text-paper/60">
        <span>© {new Date().getFullYear()} {storeConfig.brand}. {storeConfig.footerNote}</span>
        <span>INR ₹ · Meters · Demo checkout — no real payment</span>
      </div></div>
    </footer>
  );
}
