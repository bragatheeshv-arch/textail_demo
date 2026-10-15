// Cloth imagery pools — every ID below was verified HTTP 200.
// ProductImage falls back to a neutral SVG art swatch if any remote URL
// ever fails, so the storefront never shows a broken or empty image.
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

/** Textile close-ups, racks and rolls — suitable for fabric products. */
export const fabricPool: string[] = [
  U('1528459801416-a9e53bbf4e17'),
  U('1558769132-cb1aea458c5e'),
  U('1523381210434-271e8be1f52b'),
  U('1544441893-675973e31985'),
  U('1445205170230-053b83016050'),
  U('1441986300917-64674bd600d8'),
  U('1521572163474-6864f9cf17ab'),
  U('1576566588028-4147f3842f27'),
  U('1620799140408-edc6dcb6d633'),
  U('1605518216938-7c31b7b14ad0'),
  U('1537832816519-689ad163238b'),
  U('1556905055-8f358a7a47b2'),
  U('1602810318383-e386cc2a3ccf'),
];

/** Worn garments — suitable for jackets, blouses, shrugs, suits, kids. */
export const garmentPool: string[] = [
  U('1529139574466-a303027c1d8b'),
  U('1539109136881-3be0616acf4b'),
  U('1515886657613-9f3515b0c78f'),
  U('1487222477894-8943e31ef7b2'),
  U('1591047139829-d91aecb6caea'),
  U('1595777457583-95e059d581b8'),
  U('1572804013309-59a88b7e92f1'),
  U('1583743814966-8936f5b7be1a'),
];

/** Draped fashion portraits — suitable for sarees and festive edits. */
export const drapePool: string[] = [
  U('1490481651871-ab68de25d43d'),
  U('1509631179647-0177331693ae'),
  U('1496747611176-843222e1e57c'),
  U('1469334031218-e382a71b716b'),
  U('1483985988355-763728e1935b'),
  U('1594633312681-425c7b97ccd1'),
];

export const clothImages: string[] = [...fabricPool, ...garmentPool, ...drapePool];

/** Suitable photo pool per product category. */
export function poolFor(category: string): string[] {
  if (category === 'jacket' || category === 'blouse' || category === 'shrug' || category === 'suit-set' || category === 'kids' || category === 'accessory') return garmentPool;
  if (category === 'saree') return drapePool;
  return fabricPool;
}

// Deterministic pseudo-random pick so SSR/builds stay stable.
export function clothFor(category: string, seedIndex: number, offset = 0): string {
  const pool = poolFor(category);
  return pool[(seedIndex * 7 + offset * 13 + 3) % pool.length];
}

// Backwards-compatible generic pick.
export function randomCloth(seedIndex: number, offset = 0): string {
  return clothImages[(seedIndex * 7 + offset * 13 + 3) % clothImages.length];
}
