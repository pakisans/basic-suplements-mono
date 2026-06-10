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
  rows: CatalogRow[]
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
      byName.set(name, { name, tokens: tokenize(name), rows: [] })
    }
    byName.get(name)!.rows.push({
      attributes: r[attrCol] ?? '',
      sku: (r[skuCol] ?? '').trim(),
      imageUrl: (r[imgCol] ?? '').trim(),
    })
  }

  return { products: [...byName.values()] }
}

// Best matching catalog product for a seed product title (token Jaccard).
export function matchCatalogProduct(catalog: Catalog, title: string): CatalogRow[] | null {
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

function resolveOptionImage(label: string, optionImageMap: Map<string, string>): string | undefined {
  const normalized = normalizeText(label)
  if (optionImageMap.has(normalized)) return optionImageMap.get(normalized)

  // Substring match (e.g. "Cookie's & Cream" ↔ "cookie and cream" variants).
  for (const [key, url] of optionImageMap) {
    if (key.includes(normalized) || normalized.includes(key)) return url
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

/** A planned gallery slot before any media is uploaded. */
export interface GalleryPlanItem {
  url: string
  variantOption: number[]
}

interface PlanGalleryArgs {
  title: string
  /** Variant option label → variantOption id, for this product's variants. */
  optionsByLabel: Map<string, number>
  /** Product-level image URLs from the scraped source, used as a fallback. */
  fallbackImages: string[]
  catalog: Catalog
  maxImages?: number
}

/**
 * Resolve, for a single product, which catalog image each variation should use.
 * This is the pure (no DB / no network) core of the gallery builder: it maps
 * every variant option to a relevant catalog image. Options sharing the same
 * visual reuse the same image (tagged together on one gallery slot); options
 * without a dedicated catalog image fall back to the product's main image so no
 * variation is ever left without one.
 */
export function planProductGallery({
  title,
  optionsByLabel,
  fallbackImages,
  catalog,
  maxImages = 8,
}: PlanGalleryArgs): GalleryPlanItem[] {
  const rows = matchCatalogProduct(catalog, title) ?? []
  const optionImageMap = buildOptionImageMap(rows)
  const main = mainImageUrl(rows) ?? fallbackImages[0] ?? null

  // Group option ids by the image URL they resolve to.
  const urlToOptions = new Map<string, Set<number>>()
  for (const [label, optionId] of optionsByLabel) {
    const url = resolveOptionImage(label, optionImageMap) ?? main
    if (!url) continue
    if (!urlToOptions.has(url)) urlToOptions.set(url, new Set())
    urlToOptions.get(url)!.add(optionId)
  }

  // Ordered, de-duplicated URL list: main shot first, then per-option images,
  // then any remaining catalog/fallback images to round out the gallery.
  const ordered: string[] = []
  const seen = new Set<string>()
  const add = (url?: string | null) => {
    if (url && !seen.has(url)) {
      seen.add(url)
      ordered.push(url)
    }
  }
  add(main)
  for (const url of urlToOptions.keys()) add(url)
  for (const r of rows) add(r.imageUrl)
  for (const url of fallbackImages) add(url)

  return ordered.slice(0, maxImages).map((url) => ({
    url,
    variantOption: [...(urlToOptions.get(url) ?? [])],
  }))
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
