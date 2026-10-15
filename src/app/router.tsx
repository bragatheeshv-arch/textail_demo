import { Route, Routes } from 'react-router';
import HomePage from '../pages/HomePage';
import { CollectionPage } from '../pages/CollectionPages';
import ProductPage from '../pages/ProductPage';
import SearchPage from '../pages/SearchPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import CheckoutPage, { OrderSuccessPage } from '../pages/CheckoutPages';
import DashboardPage from '../pages/DashboardPage';
import { AboutPage, AccountPage, BulkPage, ContactPage, FaqPage, NotFoundPage, PolicyPage } from '../pages/SupportPages';
import { CollectionIndex } from '../components/home/sections';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections" element={<CollectionsHub />} />
      <Route path="/collections/:slug" element={<CollectionPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/bulk-orders" element={<BulkPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/policies/shipping" element={<PolicyPage title="Shipping policy" body={['Free shipping over ₹849 (demo threshold). Flat ₹79 otherwise.', 'Uncut fabrics ship in 2–4 days in demo copy; connect logistics for production.', 'Bulk timelines quoted per inquiry.']} />} />
      <Route path="/policies/returns" element={<PolicyPage title="Returns & exchanges" body={['7-day returns on uncut fabrics in original condition (demo policy).', 'Cut-to-order fabric is non-returnable once cut, except for defects.', 'Raise issues via contact with order ID and photos.']} />} />
      <Route path="/policies/privacy" element={<PolicyPage title="Privacy" body={['Demo storefront stores cart, wishlist and newsletter locally in your browser only.', 'No analytics, accounts or payments are connected in this build.', 'Production must add a real privacy notice, consent and data-processing terms.']} />} />
      <Route path="/policies/terms" element={<PolicyPage title="Terms of service" body={['All catalog, pricing and checkout behavior is illustrative demo content.', 'No real transaction occurs; demo order IDs carry no obligation.', 'Client must replace copy, imagery and policies before commercial launch.']} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router';

function CollectionsHub() {
  useEffect(() => { document.title = 'Collections — ATELIER FABRICS'; }, []);
  return (
    <main className="container-x py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-charcoal mb-3"><Link to="/" className="hover:text-burgundy">Home</Link> / Collections</nav>
      <h1 className="font-serif-d text-[clamp(34px,4vw,58px)]">Collections</h1>
      <p className="text-charcoal mt-1 mb-8">Shop by material, pattern and occasion.</p>
      <CollectionIndex />
    </main>
  );
}
