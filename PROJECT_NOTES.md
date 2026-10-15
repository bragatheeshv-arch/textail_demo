# PROJECT_NOTES — ATELIER FABRICS

## Architecture
Vite 8 + React 19 + TS strict + Tailwind v4 (CSS-first `@theme`) + React Router 8 + Zustand + Motion + Lucide + RHF/Zod. No backend; typed service seam (`src/services/shop.ts`) for future catalog/auth/payment.

## Routes
`/`, `/collections`, `/collections/:slug`, `/products/:slug`, `/search?q=`, `/cart`, `/wishlist`, `/account` (demo), `/about`, `/contact`, `/bulk-orders`, `/faq`, `/policies/{shipping,returns,privacy,terms}`, `/checkout` (demo), `/order-success`, `/dashboard` (demo random analytics), `*` 404.

## Components
- layout: AnnouncementBar, SiteHeader (sticky+mega), MobileNav, SiteFooter, CartDrawer, SearchDialog, Toast
- home/sections: Hero, CategoryShowcase, ProductRail, PatternShowcase, EditorialFeature, CraftSection, BulkPromo, Newsletter, CollectionIndex
- product: ProductImage (local SVG textile art), ProductCard, gallery+estimator in ProductPage
- collection: filter sidebar/drawer/chips/sort with URL sync

## Data model
`Product` (id/slug/title/sku/category/material/composition/colors/pattern/width/gsm/pricePaise/compareAtPaise/unit/stock/images/tags/featured/isNew/specs/care/min/max/step). 36 demo products; 12 collections; INR paise math; 0.5 m steps for meter goods.

## Env
See `.env.example`. Only `VITE_*` public placeholders. No secrets in repo.

## Demo vs production
DEMO: catalog, cart/wishlist/newsletter in localStorage (safe-parse), simulated checkout + order ID, account forms. Clearly labeled. PRODUCTION TODO: server price/inventory/coupon validation, auth provider, payment + webhooks, order DB, email/SMS, real policies/imagery, analytics.

## Commands
`npm install` · `npm run dev` · `npm run build` (tsc -b + vite) · `npx vitest run` · `npx tsc -b --noEmit` for typecheck.

## Remaining integrations
Client photography/licensing, real copy/legal review, backend + payment credentials, logistics/pincode API, hosting SPA fallback for deep routes.
