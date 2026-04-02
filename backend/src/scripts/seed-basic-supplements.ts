import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import type { File, Payload, PayloadRequest } from 'payload'
import { readFileSync, rmSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ScrapedVariant {
  name: string
  type: string
  inStock: boolean
}

interface ScrapedProduct {
  title: string
  slug: string
  url: string
  price: number
  salePrice?: number | null
  categoryPath: string[]
  images: string[]
  description: string
  variants: ScrapedVariant[]
  highlights: string[]
  specifications: { label: string; value: string }[]
}

// ---------------------------------------------------------------------------
// Helpers
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

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function descriptionToLexical(text: string) {
  const paragraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [{ type: 'text', format: 0, mode: 'normal', style: '', text: p, version: 1, detail: 0 }],
        textFormat: 0,
        textStyle: '',
      })),
    },
  }
}

// Cartesian product: [[1,2],[3,4]] → [[1,3],[1,4],[2,3],[2,4]]
function cartesian<T>(...arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((item) => [...combo, item])),
    [[]],
  )
}

// ---------------------------------------------------------------------------
// Category hierarchy
// ---------------------------------------------------------------------------
interface CategoryDef {
  title: string
  slug: string
  children?: CategoryDef[]
}

const CATEGORY_TREE: CategoryDef[] = [
  {
    title: 'Suplementi',
    slug: 'suplementi',
    children: [
      { title: 'Proteini', slug: 'proteini' },
      { title: 'Aminokiseline', slug: 'aminokiseline' },
      { title: 'Kreatini', slug: 'kreatini' },
      { title: 'Pre-Workout', slug: 'pre-workout' },
      { title: 'Vitamini i Minerali', slug: 'vitamini-i-minerali' },
      { title: 'Omega 3', slug: 'omega-3' },
      { title: 'Sagorevači Masti', slug: 'sagorevaci-masti' },
      { title: 'Stimulatori', slug: 'stimulatori' },
      { title: 'Biljni Ekstrakti', slug: 'biljni-ekstrakti' },
      { title: 'Napitci i Energetski', slug: 'napitci-i-energetski' },
    ],
  },
  {
    title: 'Oprema',
    slug: 'oprema',
    children: [
      {
        title: 'BB i Fitness Oprema',
        slug: 'bb-i-fitness-oprema',
        children: [{ title: 'Šejkeri', slug: 'sejkeri' }],
      },
      { title: 'Sportska Garderoba', slug: 'sportska-garderoba' },
    ],
  },
  {
    title: 'Zdrava Ishrana',
    slug: 'zdrava-ishrana',
    children: [{ title: 'Proteinske Čokoladice', slug: 'proteinske-cokoladice' }],
  },
  {
    title: 'Akcije',
    slug: 'akcije',
    children: [{ title: 'Super Akcije', slug: 'super-akcije' }],
  },
]

const CATEGORY_PATH_MAP: Record<string, string> = {
  PROTEINI: 'proteini',
  AMINOKISELINE: 'aminokiseline',
  KREATINI: 'kreatini',
  'PRE-WORKOUT': 'pre-workout',
  'VITAMINI I MINERALI': 'vitamini-i-minerali',
  VITAMINI: 'vitamini-i-minerali',
  'OMEGA 3': 'omega-3',
  OMEGA3: 'omega-3',
  'SAGOREVAČI MASTI': 'sagorevaci-masti',
  SAGOREVAČI: 'sagorevaci-masti',
  STIMULATORI: 'stimulatori',
  'BILJNI EKSTRAKTI': 'biljni-ekstrakti',
  'BILJNI EKSTRATI': 'biljni-ekstrakti',
  'NAPITCI I ENERGETSKI': 'napitci-i-energetski',
  NAPITCI: 'napitci-i-energetski',
  SEJKERI: 'sejkeri',
  'SPORTSKA GARDEROBA': 'sportska-garderoba',
  GARDEROBA: 'sportska-garderoba',
  'BB I FITNESS OPREMA': 'bb-i-fitness-oprema',
  'PROTEINSKE ČOKOLADICE': 'proteinske-cokoladice',
  'PROTEINSKE COKOLADICE': 'proteinske-cokoladice',
  'SUPER AKCIJE': 'super-akcije',
  AKCIJE: 'akcije',
  'PREPARATI ZA DIGESTIVNI TRAKT': 'biljni-ekstrakti',
}

// All scraped variant types → { name, label } for Payload variantType record
const VARIANT_TYPE_DEFS: { scraped: string; name: string; label: string }[] = [
  { scraped: 'ukus', name: 'ukus', label: 'Ukus' },
  { scraped: 'veličina', name: 'velicina', label: 'Veličina' },
  { scraped: 'boja', name: 'boja', label: 'Boja' },
  { scraped: 'težina', name: 'tezina', label: 'Težina' },
  { scraped: 'pakovanje', name: 'pakovanje', label: 'Pakovanje' },
]

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------
async function seedBasicSupplements({ payload, req }: { payload: Payload; req: PayloadRequest }) {
  payload.logger.info('=== Basic Supplements Seed Start ===')

  const jsonPath = resolve(__dirname, '../../products_scraped.json')
  const products: ScrapedProduct[] = JSON.parse(readFileSync(jsonPath, 'utf-8'))
  payload.logger.info(`Loaded ${products.length} products`)

  // -------------------------------------------------------------------------
  // 0. Cleanup — delete existing data to prevent duplicates on re-run
  // -------------------------------------------------------------------------
  payload.logger.info('— Cleanup (delete existing catalog data)')
  const cleanupCollections = ['variants', 'variantOptions', 'variantTypes', 'products', 'categories', 'brands', 'media'] as const
  for (const collection of cleanupCollections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    payload.logger.info(`  Cleared: ${collection}`)
  }

  // Delete uploaded media files from disk
  const mediaDir = resolve(__dirname, '../../../public/media')
  if (existsSync(mediaDir)) {
    for (const file of readdirSync(mediaDir)) {
      rmSync(join(mediaDir, file), { recursive: true, force: true })
    }
    payload.logger.info(`  Cleared media files from disk: ${mediaDir}`)
  }

  // -------------------------------------------------------------------------
  // 1. Brand
  // -------------------------------------------------------------------------
  payload.logger.info('— Brand')
  const brand = await payload.create({
    collection: 'brands',
    data: {
      title: 'Basic Supplements',
      slug: 'basic-supplements',
      description: 'Srpski brend visokokvalitetnih sportskih suplemenata.',
    },
    req,
  })

  // -------------------------------------------------------------------------
  // 2. Categories
  // -------------------------------------------------------------------------
  payload.logger.info('— Categories')
  const categoryIdBySlug = new Map<string, number>()

  async function createTree(nodes: CategoryDef[], parentId?: number) {
    for (const node of nodes) {
      const data: any = { title: node.title, slug: node.slug }
      if (parentId !== undefined) data.parent = parentId
      const created = await payload.create({ collection: 'categories', data, req })
      categoryIdBySlug.set(node.slug, created.id)
      payload.logger.info(`  ${node.title}`)
      if (node.children?.length) await createTree(node.children, created.id)
    }
  }

  await createTree(CATEGORY_TREE)

  // -------------------------------------------------------------------------
  // 3. Variant types
  // -------------------------------------------------------------------------
  payload.logger.info('— Variant types')

  // vtMap: scraped type string → { typeId, optionIdByLabel }
  const vtMap = new Map<string, { id: number; optionIdByLabel: Map<string, number> }>()

  for (const def of VARIANT_TYPE_DEFS) {
    const vt = await payload.create({
      collection: 'variantTypes',
      data: { label: def.label, name: def.name },
      req,
    })
    vtMap.set(def.scraped, { id: vt.id, optionIdByLabel: new Map() })
    payload.logger.info(`  ${def.label} (id: ${vt.id})`)
  }

  // -------------------------------------------------------------------------
  // 4. Variant options — collect all unique (type, name) across all products
  // -------------------------------------------------------------------------
  payload.logger.info('— Variant options')
  for (const p of products) {
    for (const v of p.variants) {
      const entry = vtMap.get(v.type)
      if (!entry) continue
      if (!entry.optionIdByLabel.has(v.name)) {
        const vo = await payload.create({
          collection: 'variantOptions',
          data: { variantType: entry.id, label: v.name, value: toSlug(v.name) },
          req,
        })
        entry.optionIdByLabel.set(v.name, vo.id)
      }
    }
  }

  const totalOptions = [...vtMap.values()].reduce((s, e) => s + e.optionIdByLabel.size, 0)
  payload.logger.info(`  Created ${totalOptions} variant options total`)

  // -------------------------------------------------------------------------
  // 5. Products
  // -------------------------------------------------------------------------
  payload.logger.info('— Products')

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    payload.logger.info(`  [${i + 1}/${products.length}] ${p.title}`)

    // Category ids
    const catIds: number[] = []
    for (const rawCat of p.categoryPath) {
      const slug = CATEGORY_PATH_MAP[rawCat.toUpperCase().trim()]
      if (slug && categoryIdBySlug.has(slug)) {
        catIds.push(categoryIdBySlug.get(slug)!)
      }
    }
    if (catIds.length === 0) {
      const fallback = categoryIdBySlug.get('suplementi')
      if (fallback) catIds.push(fallback)
    }

    // Upload images (max 6)
    const galleryItems: { image: number }[] = []
    for (const imgUrl of p.images.slice(0, 6)) {
      try {
        const file = await fetchFile(imgUrl)
        if (!file) continue
        const media = await payload.create({ collection: 'media', data: { alt: p.title }, file, req })
        galleryItems.push({ image: media.id })
      } catch {
        payload.logger.warn(`    Image fail: ${imgUrl}`)
      }
    }

    // Group variants by type
    const variantsByType = new Map<string, ScrapedVariant[]>()
    for (const v of p.variants) {
      if (!variantsByType.has(v.type)) variantsByType.set(v.type, [])
      variantsByType.get(v.type)!.push(v)
    }

    // Which variantType ids does this product use?
    const productVariantTypeIds: number[] = []
    for (const [scrapedType, entry] of vtMap) {
      if (variantsByType.has(scrapedType)) productVariantTypeIds.push(entry.id)
    }

    // Build product data
    const productData: any = {
      title: p.title,
      slug: p.slug,
      price: p.price,
      brand: brand.id,
      _status: 'published',
      enableVariants: p.variants.length > 0,
    }
    if (p.salePrice && p.salePrice < p.price) productData.salePrice = p.salePrice
    if (p.description) productData.description = descriptionToLexical(p.description)
    if (catIds.length > 0) productData.categories = catIds
    if (galleryItems.length > 0) productData.gallery = galleryItems
    if (p.highlights.length > 0) productData.highlights = p.highlights.slice(0, 8).map((h) => ({ label: h }))
    if (p.specifications.length > 0) productData.specifications = p.specifications.map((s) => ({ label: s.label, value: s.value }))
    if (productVariantTypeIds.length > 0) productData.variantTypes = productVariantTypeIds

    let createdProduct: { id: number }
    try {
      createdProduct = await payload.create({ collection: 'products', depth: 0, data: productData, req })
    } catch (err) {
      payload.logger.error(`    ERROR: ${err}`)
      continue
    }

    if (p.variants.length === 0) continue

    // -----------------------------------------------------------------------
    // Create variant records
    //
    // Strategy:
    //   - If product has only one type → one variant per option
    //   - If product has multiple types → Cartesian product of all types
    //     e.g. ukus×veličina or veličina×boja
    // -----------------------------------------------------------------------
    const typeKeys = [...variantsByType.keys()]

    if (typeKeys.length === 1) {
      // Single type — one variant per option
      const type = typeKeys[0]
      const entry = vtMap.get(type)!
      for (const v of variantsByType.get(type)!) {
        const optionId = entry.optionIdByLabel.get(v.name)
        if (!optionId) continue
        try {
          await payload.create({
            collection: 'variants',
            data: {
              product: createdProduct.id,
              options: [optionId],
              inventory: v.inStock ? 100 : 0,
              _status: 'published',
            } as any,
            req,
          })
        } catch (err) {
          payload.logger.warn(`    Variant fail (${v.name}): ${err}`)
        }
      }
      payload.logger.info(`    ${variantsByType.get(type)!.length} variants [${type}]`)
    } else {
      // Multiple types — Cartesian product
      const optionIdGroups: number[][] = []
      for (const type of typeKeys) {
        const entry = vtMap.get(type)!
        const ids = variantsByType
          .get(type)!
          .map((v) => entry.optionIdByLabel.get(v.name))
          .filter((id): id is number => id !== undefined)
        if (ids.length > 0) optionIdGroups.push(ids)
      }

      const combos = cartesian(...optionIdGroups)
      for (const combo of combos) {
        try {
          await payload.create({
            collection: 'variants',
            data: {
              product: createdProduct.id,
              options: combo,
              inventory: 50,
              _status: 'published',
            } as any,
            req,
          })
        } catch (err) {
          payload.logger.warn(`    Variant combo fail: ${err}`)
        }
      }
      payload.logger.info(`    ${combos.length} variants [${typeKeys.join(' × ')}]`)
    }
  }

  payload.logger.info('=== Seed Complete ===')
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------
async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  req.context = { ...req.context, disableRevalidate: true }
  await seedBasicSupplements({ payload, req })
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
