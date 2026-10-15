export interface CartLine {
  productId: string;
  slug: string;
  title: string;
  image: string;
  unitPricePaise: number;
  unit: 'meter' | 'piece';
  qty: number;
  material: string;
}

export interface OrderSummary {
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  totalPaise: number;
  lines: number;
  freeShipProgress: number;
}
