import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeConfig } from '../config/store';
import { useUI } from '../store/shopStore';

function Shell({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => { document.title = `${title} — ATELIER FABRICS`; }, [title]);
  return <main className="container-x py-12 max-w-3xl"><h1 className="font-serif-d text-[clamp(32px,4vw,54px)] mb-4">{title}</h1><div className="prose-mine space-y-4 text-[15px] leading-relaxed text-ink/85">{children}</div></main>;
}

export function AboutPage() { return <Shell title="Our story"><p>ATELIER FABRICS is a demo storefront for expressive prints and considered textures — cotton, silk, satin, linen, georgette, organza and embroidered fabrics, plus sarees, blouse materials and suit sets.</p><p>Catalog content here is illustrative placeholder. Replace with client photography, sourcing and policy copy before production launch.</p><Link to="/collections" className="inline-block mt-2 bg-ink text-paper px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Shop fabrics</Link></Shell>; }

export function ContactPage() {
  const showToast = useUI((s) => s.showToast);
  const schema = z.object({ name: z.string().min(2, 'Required'), email: z.string().email('Invalid email'), message: z.string().min(10, 'Tell us a little more (10+ chars)') });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  return <Shell title="Contact"><p>Write to {storeConfig.supportEmail} or call {storeConfig.supportPhone}. Demo form — messages are not sent anywhere.</p>
    <form onSubmit={handleSubmit(() => { showToast('Message noted (demo — not sent)'); reset(); })} className="space-y-3 mt-2" noValidate>
      <div><label className="text-[13px] font-semibold" htmlFor="c-name">Name</label><input id="c-name" {...register('name')} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.name && <p role="alert" className="text-burgundy text-[12.5px]">{errors.name.message}</p>}</div>
      <div><label className="text-[13px] font-semibold" htmlFor="c-email">Email</label><input id="c-email" {...register('email')} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.email && <p role="alert" className="text-burgundy text-[12.5px]">{errors.email.message}</p>}</div>
      <div><label className="text-[13px] font-semibold" htmlFor="c-msg">Message</label><textarea id="c-msg" rows={4} {...register('message')} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.message && <p role="alert" className="text-burgundy text-[12.5px]">{errors.message.message}</p>}</div>
      <button className="bg-burgundy text-paper px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Send (demo)</button>
    </form></Shell>;
}

export function BulkPage() {
  const showToast = useUI((s) => s.showToast);
  const schema = z.object({ name: z.string().min(2, 'Required'), email: z.string().email('Invalid email'), qty: z.string().min(1, 'Required'), detail: z.string().min(10, '10+ characters') });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  return <Shell title="Bulk & wholesale"><p>Boutiques, designers and tailors: share fabric, quantity and timeline. Demo inquiry — stored nowhere.</p>
    <form onSubmit={handleSubmit(() => { showToast('Inquiry noted (demo)'); reset(); })} className="grid sm:grid-cols-2 gap-3.5 mt-2" noValidate>
      <div><label className="text-[13px] font-semibold" htmlFor="b-name">Name</label><input id="b-name" {...register('name')} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.name && <p role="alert" className="text-burgundy text-[12.5px]">{errors.name.message}</p>}</div>
      <div><label className="text-[13px] font-semibold" htmlFor="b-email">Email</label><input id="b-email" {...register('email')} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.email && <p role="alert" className="text-burgundy text-[12.5px]">{errors.email.message}</p>}</div>
      <div><label className="text-[13px] font-semibold" htmlFor="b-qty">Quantity (meters)</label><input id="b-qty" {...register('qty')} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.qty && <p role="alert" className="text-burgundy text-[12.5px]">{errors.qty.message}</p>}</div>
      <div><label className="text-[13px] font-semibold" htmlFor="b-d">Fabric detail</label><input id="b-d" {...register('detail')} placeholder="e.g. cotton floral, 500m" className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" />{errors.detail && <p role="alert" className="text-burgundy text-[12.5px]">{errors.detail.message}</p>}</div>
      <button className="sm:col-span-2 bg-ink text-paper py-3.5 text-[13px] tracking-[0.12em] uppercase">Request quote (demo)</button>
    </form></Shell>;
}

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    ['How is fabric priced?', 'Per meter (or per piece for made-ups). Quantities support 0.5 m steps; totals use integer paise math.'],
    ['Is checkout real?', 'No — demo only. A simulated order ID is issued; connect a backend + payment provider for production.'],
    ['Do filters persist?', 'Yes — selections sync to the URL so back/forward and sharing work.'],
    ['Where do images come from?', 'Deterministic local SVG textile artwork as placeholders. Replace with licensed photography before launch.'],
    ['Do you ship bulk?', 'Use the bulk inquiry form; demo submissions are not transmitted anywhere.'],
  ];
  return <Shell title="FAQ"><div className="divide-y divide-line border-y border-line">{faqs.map(([q, a], i) => (
    <div key={q}><button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="w-full text-left py-4 font-semibold flex justify-between gap-4">{q}<span>{open === i ? '−' : '+'}</span></button>{open === i && <p className="pb-4 text-charcoal">{a}</p>}</div>))}</div></Shell>;
}

export function PolicyPage({ title, body }: { title: string; body: string[] }) {
  return <Shell title={title}>{body.map((p) => (<p key={p.slice(0, 24)}>{p}</p>))}</Shell>;
}

export function AccountPage() {
  const [tab, setTab] = useState<'in' | 'up'>('in');
  const [show, setShow] = useState(false);
  const showToast = useUI((s) => s.showToast);
  useEffect(() => { document.title = 'Account — ATELIER FABRICS'; }, []);
  return (
    <main className="container-x py-12 max-w-md">
      <p className="text-[12px] tracking-[0.2em] uppercase text-burgundy border border-burgundy w-fit px-2 py-1 mb-3">Demo only — no real auth</p>
      <h1 className="font-serif-d text-[clamp(32px,4vw,50px)] mb-5">Account</h1>
      <div className="flex border border-line mb-5" role="tablist" aria-label="Account mode">
        {(['in', 'up'] as const).map((t) => (<button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex-1 py-3 text-[13px] tracking-[0.1em] uppercase font-semibold ${tab === t ? 'bg-ink text-paper' : ''}`}>{t === 'in' ? 'Sign in' : 'Register'}</button>))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); showToast('Demo only — connect an auth provider'); }} className="space-y-3.5">
        {tab === 'up' && <div><label className="text-[13px] font-semibold" htmlFor="a-name">Full name</label><input id="a-name" required minLength={2} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" /></div>}
        <div><label className="text-[13px] font-semibold" htmlFor="a-email">Email</label><input id="a-email" type="email" required className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5" /></div>
        <div><label className="text-[13px] font-semibold" htmlFor="a-pass">Password</label>
          <div className="flex"><input id="a-pass" type={show ? 'text' : 'password'} required minLength={8} className="mt-1 flex-1 border border-line bg-paper px-3.5 py-2.5" />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="mt-1 border border-l-0 border-line px-4 text-[13px]">{show ? 'Hide' : 'Show'}</button></div></div>
        <button className="w-full bg-burgundy text-paper py-3.5 text-[13px] tracking-[0.12em] uppercase">{tab === 'in' ? 'Sign in (demo)' : 'Create account (demo)'}</button>
      </form>
      <div className="mt-6 border border-line bg-paper p-5"><h2 className="font-semibold mb-1.5">Orders</h2><p className="text-[13.5px] text-charcoal">No backend connected — order history will appear after production auth + order APIs.</p></div>
    </main>
  );
}

export function NotFoundPage() {
  useEffect(() => { document.title = 'Not found — ATELIER FABRICS'; }, []);
  return <main className="container-x py-24 text-center"><h1 className="font-serif-d text-6xl">404</h1><p className="text-charcoal mt-2 mb-6">That page doesn't exist.</p><Link to="/" className="bg-ink text-paper px-7 py-3.5 text-[13px] tracking-[0.12em] uppercase">Back home</Link></main>;
}
