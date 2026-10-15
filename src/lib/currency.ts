export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: rupees % 1 === 0 ? 0 : 2 }).format(rupees);
}

export function discountPct(pricePaise: number, compareAtPaise?: number): number | null {
  if (!compareAtPaise || compareAtPaise <= pricePaise) return null;
  return Math.round(((compareAtPaise - pricePaise) / compareAtPaise) * 100);
}

export function lineTotal(unitPricePaise: number, qty: number): number {
  return Math.round(unitPricePaise * qty);
}
