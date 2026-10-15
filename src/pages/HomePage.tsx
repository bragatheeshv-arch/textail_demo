import { useEffect } from 'react';
import { Hero, CategoryShowcase, ProductRail, PatternShowcase, EditorialFeature, CraftSection, BulkPromo, Newsletter, TrustMarquee } from '../components/home/sections';

export default function HomePage() {
  useEffect(() => { document.title = 'ATELIER FABRICS — Premium Fabric Store'; }, []);
  return (
    <main>
      <Hero />
      <TrustMarquee />
      <CategoryShowcase />
      <ProductRail title="New arrivals" kicker="Just landed" filter={(p) => !!p.isNew} link="/collections/new-arrivals" />
      <PatternShowcase />
      <EditorialFeature />
      <ProductRail title="Featured picks" kicker="Curated for makers" filter={(p) => !!p.featured} link="/collections" />
      <ProductRail title="Jackets & shrugs" kicker="Fabcurate-inspired" filter={(p) => p.category === 'jacket' || p.category === 'shrug' || p.category === 'kids'} link="/collections/jackets" />
      <ProductRail title="Festive & wedding" kicker="Occasion edits" filter={(p) => (p.tags ?? []).includes('festive')} link="/collections/festive-edit" />
      <CraftSection />
      <BulkPromo />
      <Newsletter />
    </main>
  );
}
