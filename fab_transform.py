import json, re, html, datetime

FILES = ['fab_products.json'] + [f'fab_p{i}.json' for i in range(2, 19)]
OUT = 'src/data/fabcurateSeeds.ts'

COLORS = ['White','Black','Red','Maroon','Pink','Peach','Orange','Yellow','Gold','Golden',
  'Beige','Cream','Ivory','Brown','Coffee','Green','Olive','Mint','Teal','Blue','Navy',
  'Purple','Lavender','Grey','Gray','Silver','Wine','Magenta','Coral','Turquoise','Beige',
  'Mustard','Rust','Rose','Blush','Pastel','Neon','Multi']
COLOR_HEX = {'White':'#f2efe9','Black':'#2b2b30','Red':'#a92e38','Maroon':'#6e2434',
  'Pink':'#d68ba0','Peach':'#e9b99b','Orange':'#d4712c','Yellow':'#dfa63b','Gold':'#c9a45a',
  'Golden':'#c9a45a','Beige':'#d9c8a9','Cream':'#efe6d4','Ivory':'#f4eee1','Brown':'#7a5230',
  'Coffee':'#6b4a35','Green':'#3e6b4f','Olive':'#7a7a3e','Mint':'#9dbfa8','Teal':'#2e6f6e',
  'Blue':'#3e5a78','Navy':'#2e3a62','Purple':'#6b4d8f','Lavender':'#b3a3cc','Grey':'#8e8e96',
  'Gray':'#8e8e96','Silver':'#b9bec6','Wine':'#722f37','Magenta':'#b03080','Coral':'#e0785e',
  'Turquoise':'#4fb3a9','Mustard':'#c9972e','Rust':'#a34a24','Rose':'#c9838f','Blush':'#d89aa4',
  'Pastel':'#c9d4cf','Neon':'#9fd44f','Multi':'#8a7a90'}
MOTIFS = {'Floral':'floral','Geometric':'geo','Checks':'checks','Stripes':'stripes',
  'Paisley':'paisley','Abstract':'marble','Traditional':'leaf','Botanical':'leaf',
  'Embroidered':'dots','Solid':'weave','Animal':'dots','Polka':'dots'}

MATS = ['Georgette','Chiffon','Organza','Chanderi','Mulmul','Cambric','Poplin','Viscose',
  'Velvet','Satin','Cotton','Silk','Crepe','Rayon','Linen','Net','Lace','Jacquard',
  'Lurex','Denim','Muslin','Modal','Tissue','Shimmer','Twill','Voile']

def infer_category(text):
    if re.search(r'saree|sari\b', text): return 'saree'
    if 'blouse' in text: return 'blouse'
    if 'jacket' in text: return 'jacket'
    if 'shrug' in text: return 'shrug'
    if re.search(r'suit|salwar|kurta|kurti|lehenga|gown|dress\b|skirt|top\b', text): return 'suit-set'
    if 'kid' in text: return 'kids'
    return 'fabric'

def infer_material(text, tags):
    for m in MATS:
        if re.search(r'\b' + m.lower() + r'\b', text): return m
    for t in tags:
        for m in MATS:
            if t.lower() == m.lower(): return m
    return 'Cotton'

def infer_pattern(text, tags):
    tl = text
    if re.search(r'floral|flower|botanical|leaf|garden|rose\b|tropical', tl): return 'Floral'
    if re.search(r'check|gingham|plaid', tl): return 'Geometric'
    if re.search(r'stripe|chevron|zigzag|ikat\b', tl): return 'Geometric'
    if re.search(r'geometric|trellis|diamond|triangle|polka|dot\b', tl): return 'Geometric' if 'polka' not in tl else 'Polka'
    if 'paisley' in tl or 'bandhani' in tl or 'bandhej' in tl: return 'Paisley'
    if re.search(r'ajrakh|kalamkari|madhubani|patola|banarasi|ikat|bagru|dabu|leheriya|phulkari|kantha|pichwai', tl): return 'Traditional'
    if re.search(r'sequin|schiffli|embroider|mirror|zari|threadwork|foil|lace\b|applique|cutwork', tl): return 'Embroidered'
    if re.search(r'animal|leopard|tiger|zebra', tl): return 'Animal'
    if re.search(r'abstract|marble|ombre|tie.?dye|shibori|watercolor|brush|ink\b', tl): return 'Abstract'
    if re.search(r'\bplain\b|\bsolid\b|dyed\b', tl): return 'Solid'
    return 'Floral' if 'print' in tl else 'Solid'

def infer_colors(tags, title):
    found = []
    bag = ' '.join(tags) + ' ' + title
    for c in COLORS:
        if re.search(r'\b' + c.lower() + r'\b', bag.lower()) and c not in found:
            found.append(c)
    return found[:3] or ['Multi']

def clean(s, n=200):
    s = re.sub(r'<[^>]+>', ' ', s or '')
    s = html.unescape(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s[:n]

seen = {}
for f in FILES:
    try:
        d = json.load(open(f, encoding='utf-8'))
    except FileNotFoundError:
        continue
    for p in d.get('products', []):
        seen[p['id']] = p
print('unique products:', len(seen))

existing_slugs = set()
try:
    src = open('src/data/products.ts', encoding='utf-8').read()
    existing_slugs = set(re.findall(r"slug:\s*'([^']+)'", src))
except Exception:
    pass

now = datetime.datetime.now(datetime.timezone.utc)
seeds = []
skipped = 0
cat_count = {}
for pid, p in seen.items():
    title = re.sub(r'\s+', ' ', (p.get('title') or '').strip())
    if not title:
        skipped += 1
        continue
    tags = p.get('tags') or []
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(',')]
    blob = ((p.get('product_type') or '') + ' ' + title).lower()
    category = infer_category(blob)
    material = infer_material(blob + ' ' + ' '.join(tags).lower(), tags)
    pattern = infer_pattern(blob, tags)
    colors = infer_colors(tags, title)
    v = (p.get('variants') or [{}])[0]
    try:
        price = float(v.get('price') or 0)
    except Exception:
        price = 0
    try:
        comp = float(v.get('compare_at_price') or 0)
    except Exception:
        comp = 0
    if price <= 0:
        skipped += 1
        continue
    unit = 'meter' if category == 'fabric' else 'piece'
    rupees = price * 2 if unit == 'meter' else price
    price_paise = int(round(rupees * 100))
    mrp = int(round((comp * 2 if unit == 'meter' else comp) * 100)) if comp and comp > price else None
    slug = (p.get('handle') or f'fc-{pid}').strip() or f'fc-{pid}'
    if slug in existing_slugs:
        slug = f'{slug}-fc'
    existing_slugs.add(slug)
    out_tags = []
    try:
        created = datetime.datetime.fromisoformat((p.get('created_at') or '').replace('Z', '+00:00'))
        is_new = (now - created).days < 120
    except Exception:
        is_new = False
    if comp and comp > price:
        out_tags.append('sale')
    if is_new:
        out_tags.append('new')
        if len(out_tags) > 2:
            out_tags = out_tags[:2]
    width = 58 if '58' in title else 44
    c1 = COLOR_HEX.get(colors[0], '#8a7a90')
    c2 = '#f2ede4'
    motif = MOTIFS.get(pattern, 'floral')
    cat_spaced = category.replace('-', ' ')
    desc = clean(p.get('body_html', '')) or f'{title}. Quality {material.lower()} {cat_spaced} from Fabcurate-inspired catalog.'
    seeds.append({
        'slug': slug, 'title': title[:120], 'sku': f'FC{pid}',
        'category': category, 'material': material,
        'composition': (p.get('product_type') or material)[:80],
        'colors': colors, 'pattern': pattern, 'width': width,
        'price': price_paise, 'mrp': mrp, 'unit': unit,
        'tags': out_tags, 'isNew': is_new,
        'c1': c1, 'c2': c2, 'motif': motif, 'desc': desc,
    })
    cat_count[category] = cat_count.get(category, 0) + 1

print('seeds:', len(seeds), 'skipped:', skipped, 'cats:', cat_count)

def q(v):
    return json.dumps(v, ensure_ascii=True)

lines = ["import type { Seed } from './products';", '',
         '// Auto-generated from Fabcurate public catalog snapshot (products.json, 18 pages).',
         '// Imagery is assigned from the local random cloth pool in toProduct — no hotlinked CDN.',
         'export const fabcurateSeeds: Seed[] = [']
for s in seeds:
    parts = ['slug: ' + q(s['slug']), 'title: ' + q(s['title']), 'sku: ' + q(s['sku']),
             'category: ' + q(s['category']), 'material: ' + q(s['material']),
             'composition: ' + q(s['composition']), 'colors: ' + q(s['colors']),
             'pattern: ' + q(s['pattern']), 'width: %d' % s['width'], 'price: %d' % s['price']]
    if s['mrp']:
        parts.append('mrp: %d' % s['mrp'])
    parts += ['unit: ' + q(s['unit']), 'tags: ' + q(s['tags'])]
    if s['isNew']:
        parts.append('isNew: true')
    parts += ['c1: ' + q(s['c1']), 'c2: ' + q(s['c2']), 'motif: ' + q(s['motif']), 'desc: ' + q(s['desc'])]
    lines.append('  { ' + ', '.join(parts) + ' },')
lines.append('];')
open(OUT, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('wrote', OUT)
