import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '../store/cartStore';
import { formatINR } from '../lib/currency';
import { CheckoutService } from '../services/shop';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  first: z.string().min(2, 'Required'), last: z.string().min(2, 'Required'),
  address: z.string().min(6, 'Enter full address'), city: z.string().min(2, 'Required'),
  pin: z.string().regex(/^\d{6}$/, '6-digit pincode'), phone: z.string().regex(/^[6-9]\d{9}$/, '10-digit mobile'),
  coupon: z.string().optional(),
});
type Form = z.infer<typeof schema>;

export default function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const summary = useCart((s) => s.summary)();
  const clear = useCart((s) => s.clear);
  const nav = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  useEffect(() => { document.title = 'Checkout — ATELIER FABRICS'; }, []);
  if (lines.length === 0) return <main className="container-x py-20 text-center"><h1 className="font-serif-d text-4xl mb-3">Nothing to check out</h1><Link to="/collections" className="underline">Browse fabrics</Link></main>;

  const onSubmit = async (data: Form) => {
    setPlacing(true); setError(null);
    try {
      const order = await CheckoutService.placeDemoOrder(data.email, summary.totalPaise, lines.length);
      clear();
      nav(`/order-success?id=${order.id}&total=${order.totalPaise}&email=${encodeURIComponent(order.email)}`);
    } catch { setError('Demo order failed. Please try again.'); } finally { setPlacing(false); }
  };

  const input = (name: keyof Form, label: string, props: object = {}) => (
    <div><label htmlFor={name} className="text-[12.5px] font-semibold">{label}</label>
      <input id={name} {...register(name)} {...props} aria-invalid={!!errors[name]} className="mt-1 w-full border border-line bg-paper px-3.5 py-2.5 outline-none focus:border-burgundy" />
      {errors[name] && <p role="alert" className="text-burgundy text-[12.5px] mt-1">{errors[name]?.message as string}</p>}</div>
  );

  return (
    <main className="container-x py-10">
      <h1 className="font-serif-d text-[clamp(32px,4vw,52px)]">Checkout <span className="text-[13px] font-sans align-middle ml-2 border border-burgundy text-burgundy px-2 py-1 tracking-[0.12em]">DEMO — NO REAL PAYMENT</span></h1>
      <p className="text-charcoal text-[14px] mt-1">Simulated checkout. No money moves; integrate a payment provider for production.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_360px] gap-10 mt-7" noValidate>
        <div className="space-y-6">
          <section className="border border-line bg-paper p-6"><h2 className="font-semibold mb-4">Contact</h2><div className="grid sm:grid-cols-2 gap-4">{input('email', 'Email', { type: 'email' })}{input('phone', 'Mobile', { inputMode: 'numeric' })}</div></section>
          <section className="border border-line bg-paper p-6"><h2 className="font-semibold mb-4">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-4">{input('first', 'First name')}{input('last', 'Last name')}
            <div className="sm:col-span-2">{input('address', 'Address')}</div>{input('city', 'City')}{input('pin', 'Pincode', { inputMode: 'numeric' })}</div></section>
          <section className="border border-line bg-paper p-6"><h2 className="font-semibold mb-2">Coupon (demo)</h2>
            <input {...register('coupon')} placeholder="Try ATELIER10" aria-label="Coupon code" className="w-full border border-line px-3.5 py-2.5 outline-none" />
            <p className="text-[12.5px] text-charcoal mt-1.5">Demo coupons are illustrative and not validated server-side.</p></section>
          {error && <p role="alert" className="border border-burgundy text-burgundy px-4 py-3 text-sm">{error}</p>}
        </div>
        <aside className="border border-line bg-paper p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-serif-d text-2xl mb-3">Order summary</h2>
          <ul className="text-[13.5px] divide-y divide-line mb-3">{lines.map((l) => (<li key={l.productId} className="py-2 flex justify-between gap-2"><span className="text-charcoal">{l.title} × {l.qty}</span><span className="font-semibold whitespace-nowrap">{formatINR(Math.round(l.unitPricePaise * l.qty))}</span></li>))}</ul>
          <div className="space-y-1 text-[14px]"><div className="flex justify-between"><span className="text-charcoal">Subtotal</span><span className="font-bold">{formatINR(summary.subtotalPaise)}</span></div>
          <div className="flex justify-between"><span className="text-charcoal">Shipping</span><span>{summary.shippingPaise === 0 ? 'Free' : formatINR(summary.shippingPaise)}</span></div>
          <div className="flex justify-between text-[16px] pt-2 border-t border-line"><span className="font-semibold">Total</span><span className="font-bold">{formatINR(summary.totalPaise)}</span></div></div>
          <button disabled={placing} className="w-full mt-5 bg-burgundy text-paper py-4 text-[13px] tracking-[0.14em] uppercase disabled:opacity-50">{placing ? 'Placing demo order…' : 'Place demo order'}</button>
        </aside>
      </form>
    </main>
  );
}

export function OrderSuccessPage() {
  const q = new URLSearchParams(window.location.search);
  useEffect(() => { document.title = 'Order confirmed — ATELIER FABRICS'; }, []);
  return (
    <main className="container-x py-20 text-center max-w-lg mx-auto">
      <p className="text-[12px] tracking-[0.22em] uppercase text-olive">Demo confirmation — not a real purchase</p>
      <h1 className="font-serif-d text-[clamp(34px,4vw,56px)] mt-2">Thank you!</h1>
      <p className="text-charcoal mt-3">Order <strong className="text-ink">{q.get('id')}</strong> for <strong className="text-ink">{formatINR(Number(q.get('total') ?? 0))}</strong> was simulated{q.get('email') ? <> for {q.get('email')}</> : null}. A production store would now create the order server-side and verify payment.</p>
      <div className="flex gap-2.5 justify-center mt-7"><Link to="/collections" className="bg-ink text-paper px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Keep shopping</Link><Link to="/" className="border border-ink px-6 py-3 text-[13px] tracking-[0.12em] uppercase">Home</Link></div>
    </main>
  );
}
