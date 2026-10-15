import type { Collection } from '../types/product';

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
// Verified-200 cloth/fashion photos, themed per collection.
const IMG = {
  cotton: U('1521572163474-6864f9cf17ab'),
  silk: U('1490481651871-ab68de25d43d'),
  satin: U('1509631179647-0177331693ae'),
  linen: U('1496747611176-843222e1e57c'),
  viscose: U('1523381210434-271e8be1f52b'),
  poplin: U('1576566588028-4147f3842f27'),
  plain: U('1556905055-8f358a7a47b2'),
  pleated: U('1515886657613-9f3515b0c78f'),
  floral: U('1528459801416-a9e53bbf4e17'),
  geometric: U('1441986300917-64674bd600d8'),
  animal: U('1539109136881-3be0616acf4b'),
  abstract: U('1529139574466-a303027c1d8b'),
  embroidered: U('1594633312681-425c7b97ccd1'),
  saree: U('1469334031218-e382a71b716b'),
  blouse: U('1595777457583-95e059d581b8'),
  jacket: U('1591047139829-d91aecb6caea'),
  shrug: U('1487222477894-8943e31ef7b2'),
  suit: U('1483985988355-763728e1935b'),
  festive: U('1537832816519-689ad163238b'),
  wedding: U('1445205170230-053b83016050'),
  sale: U('1544441893-675973e31985'),
  botanical: U('1558769132-cb1aea458c5e'),
  heritage: U('1605518216938-7c31b7b14ad0'),
  new: U('1602810318383-e386cc2a3ccf'),
};

export const collections: Collection[] = [
  { slug: 'new-arrivals', title: 'New Arrivals', description: 'Fresh prints and fabrics added this season.', image: IMG.new, filter: { tag: 'new' } },
  { slug: 'cotton', title: 'Cotton Fabrics', description: 'Breathable cambric, poplin, mulmul and flex.', image: IMG.cotton, filter: { material: 'Cotton' } },
  { slug: 'silk', title: 'Silk & Silk Blends', description: 'Art silk, gaji, uppada and modal silk.', image: IMG.silk, filter: { material: 'Silk' } },
  { slug: 'satin', title: 'Satin Fabrics', description: 'Japan, charmeuse, lush and imported satins.', image: IMG.satin, filter: { material: 'Satin' } },
  { slug: 'linen', title: 'Linen Fabrics', description: 'Pure and textured linens in soft neutrals.', image: IMG.linen, filter: { material: 'Linen' } },
  { slug: 'viscose', title: 'Pure Viscose Fabrics', description: 'Fluid viscose challis, crepe and prints.', image: IMG.viscose, filter: { material: 'Viscose' } },
  { slug: 'poplin', title: 'Poplin 58" Fabrics', description: 'Wide-width poplin checks and florals.', image: IMG.poplin, filter: { material: 'Poplin' } },
  { slug: 'plain', title: 'Plain Fabrics', description: 'Solids and garment-dyed bases for mixing.', image: IMG.plain, filter: { pattern: 'Solid' } },
  { slug: 'pleated', title: 'Pleated Fabrics', description: 'Sunburst pleats on georgette and satin.', image: IMG.pleated, filter: { tag: 'new' } },
  { slug: 'printed-floral', title: 'Floral Prints', description: 'Botanical florals across georgette, crepe and cotton.', image: IMG.floral, filter: { pattern: 'Floral' } },
  { slug: 'geometric', title: 'Geometric Prints', description: 'Checks, chevrons, stripes and trellis geometry.', image: IMG.geometric, filter: { pattern: 'Geometric' } },
  { slug: 'animal', title: 'Animal Prints', description: 'Leopard and wild motifs on crepe.', image: IMG.animal, filter: { pattern: 'Animal' } },
  { slug: 'abstract', title: 'Abstract Prints', description: 'Marble, ombre and ink abstracts.', image: IMG.abstract, filter: { pattern: 'Abstract' } },
  { slug: 'embroidered', title: 'Embroidered & Sequins', description: 'Schiffli, sequins, foil and mirror work.', image: IMG.embroidered, filter: { pattern: 'Embroidered' } },
  { slug: 'sarees', title: 'Sarees', description: 'Designer sarees in crepe silk, georgette and velvet.', image: IMG.saree, filter: { category: 'saree' } },
  { slug: 'blouses', title: 'Designer Blouses', description: 'Ready-made velvet, cotton and brocade blouses.', image: IMG.blouse, filter: { category: 'blouse' } },
  { slug: 'jackets', title: 'Jackets', description: 'Embroidered and velvet jackets.', image: IMG.jacket, filter: { category: 'jacket' } },
  { slug: 'shrugs', title: 'Shrugs', description: 'Sheer chiffon and net shrugs.', image: IMG.shrug, filter: { category: 'shrug' } },
  { slug: 'suit-sets', title: 'Unstitched Suit Sets', description: 'Top + bottom + dupatta sets.', image: IMG.suit, filter: { category: 'suit-set' } },
  { slug: 'festive-edit', title: 'Festivals Edit 2026', description: 'Diwali-ready reds, golds and pleats.', image: IMG.festive, filter: { tag: 'festive' }, editorial: true },
  { slug: 'wedding-edit', title: 'Wedding Fabric Edit', description: 'Ivory silks and opulent textures.', image: IMG.wedding, filter: { pattern: 'Traditional' }, editorial: true },
  { slug: 'sale', title: 'Sale', description: 'Discounted fabrics while stock lasts.', image: IMG.sale, filter: { tag: 'sale' } },
  { slug: 'botanical-edit', title: 'The Botanical Edit', description: 'Leaf, tropical and garden-inspired prints.', image: IMG.botanical, filter: { pattern: 'Botanical' }, editorial: true },
  { slug: 'heritage', title: 'Modern Heritage', description: 'Ajrakh, bandhani, ikat and kalamkari-inspired craft.', image: IMG.heritage, filter: { pattern: 'Traditional' }, editorial: true },
];

export interface NavMegaColumn { heading: string; links: { label: string; to: string }[] }
export interface NavEntry { label: string; to: string; mega?: { columns: NavMegaColumn[]; feature?: { title: string; copy: string; to: string } } }

export const navigation: NavEntry[] = [
  {
    label: 'Fabrics', to: '/collections',
    mega: {
      columns: [
        { heading: 'By Material', links: [
          { label: 'Cotton', to: '/collections/cotton' }, { label: 'Silk & Blends', to: '/collections/silk' },
          { label: 'Satin', to: '/collections/satin' }, { label: 'Linen', to: '/collections/linen' },
          { label: 'Embroidered', to: '/collections/embroidered' }, { label: 'New Arrivals', to: '/collections/new-arrivals' },
        ]},
        { heading: 'By Pattern', links: [
          { label: 'Floral', to: '/collections/printed-floral' }, { label: 'Geometric', to: '/collections/geometric' },
          { label: 'Botanical', to: '/collections/botanical-edit' }, { label: 'Traditional', to: '/collections/heritage' },
          { label: 'Sale', to: '/collections/sale' },
        ]},
      ],
      feature: { title: 'The Botanical Edit', copy: 'Garden-inspired prints on crepe & georgette.', to: '/collections/botanical-edit' },
    },
  },
  { label: 'New Arrivals', to: '/collections/new-arrivals' },
  { label: 'Prints & Patterns', to: '/collections/printed-floral' },
  { label: 'Sarees', to: '/collections/sarees' },
  { label: 'Jackets', to: '/collections/jackets' },
  { label: 'Shrugs', to: '/collections/shrugs' },
  { label: 'Collections', to: '/collections' },
  { label: 'Sale', to: '/collections/sale' },
  { label: 'Bulk Orders', to: '/bulk-orders' },
];
