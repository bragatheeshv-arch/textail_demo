export const storeConfig = {
  brand: 'ATELIER FABRICS',
  tagline: 'Made to inspire. Designed to become yours.',
  subline: 'Discover expressive prints, considered textures, and beautiful fabrics for your next creation.',
  currency: 'INR',
  locale: 'en-IN',
  priceUnitDefault: 'meter',
  supportEmail: 'hello@atelierfabrics.in',
  supportPhone: '+91 98765 43210',
  address: '14 Weaver Lane, Fort, Mumbai 400001',
  freeShippingThresholdPaise: 84900,
  shippingFlatPaise: 7900,
  announcements: [
    'New: The Botanical Edit has arrived',
    'Free shipping on orders over ₹849',
    'Bulk & boutique inquiries welcome',
  ],
  socials: { instagram: '#', pinterest: '#', youtube: '#', facebook: '#', x: '#' },
  footerNote: 'Demo storefront. Catalog, prices and checkout are illustrative until production backend is connected.',
} as const;

export type StoreConfig = typeof storeConfig;
