export type StockStatus = 'in' | 'low' | 'out';

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  sku: string;
  category: 'fabric' | 'saree' | 'blouse' | 'suit-set' | 'accessory' | 'jacket' | 'shrug' | 'kids';
  material: string;
  composition: string;
  colors: string[];
  pattern: string;
  widthInch: number;
  gsm?: number;
  pricePaise: number;
  compareAtPaise?: number;
  unit: 'meter' | 'piece';
  stockStatus: StockStatus;
  stockQty: number;
  images: string[];
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  createdAt: string;
  specs: { label: string; value: string }[];
  care: string[];
  minQty: number;
  maxQty: number;
  stepQty: number;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  image: string;
  filter: Partial<Record<'material' | 'pattern' | 'category' | 'color' | 'tag', string>>;
  editorial?: boolean;
}
