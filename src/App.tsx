import { BrowserRouter } from 'react-router';
import { Suspense, useEffect } from 'react';
import Router from './app/router';
import { AnnouncementBar, SiteHeader, MobileNav, SiteFooter } from './components/layout/chrome';
import CartDrawer from './components/cart/CartDrawer';
import SearchDialog from './components/search/SearchDialog';
import Toast from './components/ui/Toast';

function ScrollTop() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-paper focus:px-4 focus:py-2">Skip to content</a>
      <AnnouncementBar />
      <SiteHeader />
      <div id="main"><Suspense fallback={<p className="container-x py-20">Loading…</p>}><Router /></Suspense></div>
      <SiteFooter />
      <CartDrawer />
      <SearchDialog />
      <MobileNav />
      <Toast />
      <ScrollTop />
    </BrowserRouter>
  );
}
