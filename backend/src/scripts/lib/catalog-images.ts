import type { File, Payload, PayloadRequest } from 'payload'
import { readFileSync } from 'fs'

// ---------------------------------------------------------------------------
// Catalog-driven variation images
//
// The product/variation structure is seeded from `products_scraped.json`, but
// that source has no per-variation imagery. The exported WooCommerce catalog
// (`products_catalog.csv`) lists one row per variation with an explicit image
// URL and the attribute it belongs to (Ukus / Boja / Veličina). We use that CSV
// as the authoritative source to assign a relevant image to every variation.
//
// Images are attached through the product `gallery` array: each gallery item is
// `{ image, variantOption[] }`. The storefront `Gallery` component scrolls to
// the gallery item whose `variantOption` matches the currently selected option,
// so tagging gallery items per option is how a variation "gets its own image".
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Text normalization & fuzzy matching
// ---------------------------------------------------------------------------
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokenize(text: string): Set<string> {
  return new Set(normalizeText(text).split(' ').filter(Boolean))
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  const union = new Set([...a, ...b]).size
  return union === 0 ? 0 : inter / union
}

// ---------------------------------------------------------------------------
// Minimal CSV parser (handles the `;` delimiter and quoted fields used by the
// catalog export, including quoted values that themselves contain `;` or `,`).
// ---------------------------------------------------------------------------
function parseCsv(content: string, delimiter = ';'): string[][] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

// ---------------------------------------------------------------------------
// Catalog index
// ---------------------------------------------------------------------------
interface CatalogRow {
  attributes: string
  sku: string
  imageUrl: string
}

interface CatalogProduct {
  name: string
  tokens: Set<string>
  /** Image filenames (no path/extension) — a language-independent match key. */
  imageFilenames: Set<string>
  rows: CatalogRow[]
}

function imageFilename(url: string): string {
  return (url.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '').toLowerCase()
}

export interface Catalog {
  products: CatalogProduct[]
}

export function loadCatalog(csvPath: string): Catalog {
  const content = readFileSync(csvPath, 'utf-8')
  const rows = parseCsv(content)
  if (rows.length === 0) return { products: [] }

  const header = rows[0].map((h) => normalizeText(h))
  const findCol = (...keywords: string[]) =>
    header.findIndex((h) => keywords.every((kw) => h.includes(kw)))

  // Resolve columns by header text, falling back to the known export layout.
  const nameCol = findCol('naziv', 'proizvoda') >= 0 ? findCol('naziv', 'proizvoda') : 1
  const skuCol = findCol('sku', 'varijacije') >= 0 ? findCol('sku', 'varijacije') : 5
  const attrCol = findCol('atributi') >= 0 ? findCol('atributi') : 6
  const imgCol = findCol('url', 'slike') >= 0 ? findCol('url', 'slike') : 10

  const byName = new Map<string, CatalogProduct>()
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const name = (r[nameCol] ?? '').trim()
    if (!name) continue
    if (!byName.has(name)) {
      byName.set(name, { name, tokens: tokenize(name), imageFilenames: new Set(), rows: [] })
    }
    const product = byName.get(name)!
    const imageUrl = (r[imgCol] ?? '').trim()
    product.rows.push({
      attributes: r[attrCol] ?? '',
      sku: (r[skuCol] ?? '').trim(),
      imageUrl,
    })
    if (imageUrl) product.imageFilenames.add(imageFilename(imageUrl))
  }

  return { products: [...byName.values()] }
}

// Best matching catalog product. Primary key is image-filename overlap (the same
// shop images are referenced by both the scraped JSON and the CSV, so this works
// regardless of language); falls back to product-title token Jaccard.
export function matchCatalogProduct(
  catalog: Catalog,
  title: string,
  imageUrls: string[] = [],
): CatalogRow[] | null {
  const wantedFilenames = new Set(imageUrls.map(imageFilename).filter(Boolean))
  if (wantedFilenames.size > 0) {
    let best: CatalogProduct | null = null
    let bestOverlap = 0
    for (const product of catalog.products) {
      let overlap = 0
      for (const f of product.imageFilenames) if (wantedFilenames.has(f)) overlap++
      if (overlap > bestOverlap) {
        bestOverlap = overlap
        best = product
      }
    }
    if (best && bestOverlap > 0) return best.rows
  }

  const titleTokens = tokenize(title)
  let best: CatalogProduct | null = null
  let bestScore = 0
  for (const product of catalog.products) {
    const score = jaccard(titleTokens, product.tokens)
    if (score > bestScore) {
      bestScore = score
      best = product
    }
  }
  return bestScore >= 0.3 && best ? best.rows : null
}

// Build a map of normalized attribute value → image URL for flavour (Ukus) and
// colour (Boja). Sizes (Veličina) and weights do not change the visual, so they
// are intentionally excluded and fall back to the product's main image.
function buildOptionImageMap(rows: CatalogRow[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const r of rows) {
    if (!r.imageUrl) continue
    for (const part of r.attributes.split(',')) {
      const sep = part.indexOf(':')
      if (sep === -1) continue
      const key = normalizeText(part.slice(0, sep))
      if (key !== 'ukus' && key !== 'boja') continue
      // Colour values can embed a nested size, e.g. "Crna | Veličina:L" → "Crna".
      const value = normalizeText(part.slice(sep + 1).split('|')[0])
      if (value && !map.has(value)) map.set(value, r.imageUrl)
    }
  }
  return map
}

// The most frequently occurring image across a product's rows is the generic
// product shot — a safe fallback for variations without a dedicated image.
function mainImageUrl(rows: CatalogRow[]): string | null {
  const counts = new Map<string, number>()
  for (const r of rows) {
    if (!r.imageUrl) continue
    counts.set(r.imageUrl, (counts.get(r.imageUrl) ?? 0) + 1)
  }
  let best: string | null = null
  let bestCount = 0
  for (const [url, count] of counts) {
    if (count > bestCount) {
      bestCount = count
      best = url
    }
  }
  return best
}

// English option labels → Serbian (the catalog CSV vocabulary). The catalog is
// Serbian, so the English seed needs this bridge to match colour/flavour images.
const LABEL_SYNONYMS: Record<string, string> = {
  black: 'crna',
  white: 'belo',
  grey: 'siva',
  gray: 'siva',
  'dark grey': 'tamno siva',
  'dark gray': 'tamno siva',
  'light grey': 'svetlo siva',
  'light gray': 'svetlo siva',
  beige: 'bez',
  green: 'zelena',
  olive: 'maslinasto zelena',
  'olive green': 'maslinasto zelena',
  orange: 'narandzasta',
  blue: 'plava',
  red: 'crvena',
  pink: 'roza',
  cream: 'creme',
  cappuccino: 'boja kapucina',
}

function resolveOptionImage(label: string, optionImageMap: Map<string, string>): string | undefined {
  const normalized = normalizeText(label)
  // Try the label as-is and its Serbian synonym (for the English seed).
  const candidates = [normalized]
  if (LABEL_SYNONYMS[normalized]) candidates.push(LABEL_SYNONYMS[normalized])

  for (const candidate of candidates) {
    if (optionImageMap.has(candidate)) return optionImageMap.get(candidate)
  }

  // Substring match (e.g. "Cookie's & Cream" ↔ "cookie and cream" variants).
  for (const [key, url] of optionImageMap) {
    for (const candidate of candidates) {
      if (key.includes(candidate) || candidate.includes(key)) return url
    }
  }

  // Token-overlap fallback for minor wording differences (plurals, ordering).
  const labelTokens = tokenize(label)
  let best: string | undefined
  let bestScore = 0
  for (const [key, url] of optionImageMap) {
    const score = jaccard(labelTokens, tokenize(key))
    if (score > bestScore) {
      bestScore = score
      best = url
    }
  }
  return bestScore >= 0.6 ? best : undefined
}

// ---------------------------------------------------------------------------
// Weight / package image matching
//
// Multi-weight products are merged from several source listings, and each source
// image's filename encodes the weight (e.g. ".../pro-whey-908grama-...jpg",
// ".../pro-whey-227kg-...jpg" → 2.27 kg = 2270 g). We match a weight option to
// the image whose filename contains a matching numeric signature.
// ---------------------------------------------------------------------------
function weightSignatures(label: string): string[] {
  const lower = label.toLowerCase()
  const match = lower.match(/[0-9]+(?:[.,][0-9]+)?/)
  if (!match) return []
  const numStr = match[0]
  const value = parseFloat(numStr.replace(',', '.'))
  const sigs = new Set<string>()
  sigs.add(numStr.replace(/[.,]/g, '')) // raw digits, e.g. "908", "2270"
  if (lower.includes('kg')) {
    sigs.add(String(Math.round(value * 1000))) // "2kg" → "2000"
  } else if (value >= 1000 && Number.isInteger(value)) {
    sigs.add(String(value / 1000).replace(/[.,]/g, '')) // 2270 g → "2.27" → "227"
  }
  sigs.delete('')
  // Most specific (longest) signatures first to avoid short ones (e.g. "2")
  // matching the wrong image.
  return [...sigs].sort((a, b) => b.length - a.length)
}

function imageDigitTokens(url: string): Set<string> {
  const slug = url.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
  return new Set(slug.match(/[0-9]+/g) ?? [])
}

function matchWeightImage(label: string, imageUrls: string[]): string | undefined {
  const sigs = weightSignatures(label)
  if (sigs.length === 0) return undefined
  for (const sig of sigs) {
    for (const url of imageUrls) {
      if (imageDigitTokens(url).has(sig)) return url
    }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Media upload (with per-run deduplication by URL)
// ---------------------------------------------------------------------------
async function fetchFile(url: string): Promise<File | null> {
  try {
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg'
    const name = url.split('/').pop()?.split('?')[0] ?? `img-${Date.now()}.${ext}`
    return {
      name,
      data: Buffer.from(data),
      mimetype: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      size: data.byteLength,
    }
  } catch {
    return null
  }
}

async function getOrUploadMedia(
  payload: Payload,
  req: PayloadRequest,
  url: string,
  alt: string,
  cache: Map<string, number>,
): Promise<number | null> {
  const cached = cache.get(url)
  if (cached !== undefined) return cached

  const file = await fetchFile(url)
  if (!file) return null

  const media = await payload.create({ collection: 'media', data: { alt }, file, req })
  cache.set(url, media.id)
  return media.id
}

// ---------------------------------------------------------------------------
// Gallery builder
// ---------------------------------------------------------------------------
export interface GalleryItem {
  image: number
  variantOption?: number[]
}

/** A variant option with its scraped type (ukus / boja / težina / …). */
export interface ProductOption {
  id: number
  type: string
}

/** A planned gallery slot before any media is uploaded. */
export interface GalleryPlanItem {
  url: string
  variantOption: number[]
}

interface PlanGalleryArgs {
  title: string
  /** Variant option label → { id, type } for this product's variants. */
  optionsByLabel: Map<string, ProductOption>
  /** Product-level image URLs from the scraped source (also the weight source). */
  fallbackImages: string[]
  catalog: Catalog
  /** Max number of untagged base images for products without variants. */
  maxImages?: number
}

/**
 * Resolve which catalog image each variation should use, producing ONE gallery
 * slot per variant option (each tagged with a single option) so every variation
 * is represented separately — flavour, weight, colour, etc. This is the pure
 * (no DB / no network) core of the gallery builder.
 *
 * Image resolution is CSV/catalog-driven, with type names matched in both
 * Serbian (seed:bs) and English (seed:bs:en):
 *   - flavour (ukus/flavor) / colour (boja/color): matched against the CSV
 *   - weight (težina/weight) / package (pakovanje/packaging): matched against
 *     image filenames (which encode the weight, e.g. 227kg = 2270 g)
 *   - everything else (e.g. size/veličina) has no dedicated image and reuses the
 *     product's main image
 * Options without a dedicated image fall back to the main image, so no variation
 * is ever left without one.
 */
export function planProductGallery({
  title,
  optionsByLabel,
  fallbackImages,
  catalog,
  maxImages = 8,
}: PlanGalleryArgs): GalleryPlanItem[] {
  const rows = matchCatalogProduct(catalog, title, fallbackImages) ?? []
  const optionImageMap = buildOptionImageMap(rows)
  const main = mainImageUrl(rows) ?? fallbackImages[0] ?? null

  const items: GalleryPlanItem[] = []

  // 1) The product's main image as an untagged base (shown by default).
  if (main) items.push({ url: main, variantOption: [] })

  // 2) One slot per variant option, each tagged with that single option.
  for (const [label, { id, type }] of optionsByLabel) {
    const t = normalizeText(type)
    let url: string | undefined
    if (t === 'ukus' || t === 'flavor' || t === 'boja' || t === 'color') {
      url = resolveOptionImage(label, optionImageMap)
    } else if (t === 'tezina' || t === 'weight' || t === 'pakovanje' || t === 'packaging') {
      url = matchWeightImage(label, fallbackImages)
    }
    url = url ?? main ?? undefined
    if (!url) continue
    items.push({ url, variantOption: [id] })
  }

  // 3) For products without variants, round out the gallery with extra images.
  if (optionsByLabel.size === 0) {
    const seen = new Set(items.map((i) => i.url))
    for (const url of [...rows.map((r) => r.imageUrl), ...fallbackImages]) {
      if (items.length >= maxImages) break
      if (!url || seen.has(url)) continue
      seen.add(url)
      items.push({ url, variantOption: [] })
    }
  }

  return items
}

interface BuildGalleryArgs extends PlanGalleryArgs {
  payload: Payload
  req: PayloadRequest
  /** Shared URL → media id cache for the whole seed run (avoids re-uploading). */
  mediaCache: Map<string, number>
}

/**
 * Build a product gallery from the catalog: plans the per-variation image
 * mapping, then uploads each image (de-duplicated via {@link mediaCache}) and
 * returns gallery items tagged with their variant options.
 */
export async function buildProductGallery({
  payload,
  req,
  mediaCache,
  ...planArgs
}: BuildGalleryArgs): Promise<GalleryItem[]> {
  const plan = planProductGallery(planArgs)

  const items: GalleryItem[] = []
  for (const slot of plan) {
    const id = await getOrUploadMedia(payload, req, slot.url, planArgs.title, mediaCache)
    if (id === null) continue
    items.push(slot.variantOption.length > 0 ? { image: id, variantOption: slot.variantOption } : { image: id })
  }
  return items
}
