import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import type { Payload, PayloadRequest } from 'payload'
import { readFileSync, rmSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { buildProductGallery, loadCatalog, loadScrapeCatalog, mergeCatalogs } from './lib/catalog-images'

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
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
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
    title: 'Supplements',
    slug: 'supplements',
    children: [
      { title: 'Proteins', slug: 'proteins' },
      { title: 'Amino Acids', slug: 'amino-acids' },
      { title: 'Creatines', slug: 'creatines' },
      { title: 'Pre-Workout', slug: 'pre-workout' },
      { title: 'Vitamins and Minerals', slug: 'vitamins-and-minerals' },
      { title: 'Omega 3', slug: 'omega-3' },
      { title: 'Fat Burners', slug: 'fat-burners' },
      { title: 'Stimulants', slug: 'stimulants' },
      { title: 'Herbal Extracts', slug: 'herbal-extracts' },
      { title: 'Drinks and Energy', slug: 'drinks-and-energy' },
    ],
  },
  {
    title: 'Equipment',
    slug: 'equipment',
    children: [
      {
        title: 'Bodybuilding and Fitness Equipment',
        slug: 'bb-and-fitness-equipment',
        children: [{ title: 'Shakers', slug: 'shakers' }],
      },
      { title: 'Sports Clothing', slug: 'sports-clothing' },
    ],
  },
  {
    title: 'Healthy Nutrition',
    slug: 'healthy-nutrition',
    children: [{ title: 'Protein Bars', slug: 'protein-bars' }],
  },
  {
    title: 'Promotions',
    slug: 'promotions',
    children: [{ title: 'Super Deals', slug: 'super-deals' }],
  },
]

// Keys are English (matching translated JSON), values are English slugs
const CATEGORY_PATH_MAP: Record<string, string> = {
  PROTEINS: 'proteins',
  'AMINO ACIDS': 'amino-acids',
  CREATINES: 'creatines',
  'PRE-WORKOUT': 'pre-workout',
  'VITAMINS AND MINERALS': 'vitamins-and-minerals',
  'OMEGA 3': 'omega-3',
  'FAT BURNERS': 'fat-burners',
  STIMULANTS: 'stimulants',
  'HERBAL EXTRACTS': 'herbal-extracts',
  'DRINKS AND ENERGY': 'drinks-and-energy',
  SHAKERS: 'shakers',
  'SPORTS CLOTHING': 'sports-clothing',
  'BB AND FITNESS EQUIPMENT': 'bb-and-fitness-equipment',
  'PROTEIN BARS': 'protein-bars',
  'HEALTHY NUTRITION': 'healthy-nutrition',
  'SUPER DEALS': 'super-deals',
  PROMOTIONS: 'promotions',
}

// JSON variant types are now English (flavor, size, color, weight, packaging)
const VARIANT_TYPE_DEFS: { scraped: string; name: string; label: string }[] = [
  { scraped: 'flavor', name: 'flavor', label: 'Flavor' },
  { scraped: 'size', name: 'size', label: 'Size' },
  { scraped: 'color', name: 'color', label: 'Color' },
  { scraped: 'weight', name: 'weight', label: 'Weight' },
  { scraped: 'packaging', name: 'packaging', label: 'Packaging' },
]

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------
async function seedBasicSupplements({ payload, req }: { payload: Payload; req: PayloadRequest }) {
  payload.logger.info('=== Basic Supplements Seed (English) Start ===')

  const enJsonPath = resolve(__dirname, '../../products_scraped_en.json')
  const jsonPath = existsSync(enJsonPath) ? enJsonPath : resolve(__dirname, '../../products_scraped.json')
  if (jsonPath.endsWith('products_scraped.json')) {
    payload.logger.warn('products_scraped_en.json not found — falling back to Serbian source. Run: pnpm translate:products first.')
  }
  const products: ScrapedProduct[] = JSON.parse(readFileSync(jsonPath, 'utf-8'))
  payload.logger.info(`Loaded ${products.length} products`)

  // Per-variation image catalogs. The scrape (ogistra_images.json) has one exact
  // image per variant option and is preferred; the CSV export is the fallback.
  const catalog = mergeCatalogs(
    loadScrapeCatalog(resolve(__dirname, '../../ogistra_images.json')),
    loadCatalog(resolve(__dirname, '../../products_catalog.csv')),
  )
  payload.logger.info(`Loaded image catalog: ${catalog.products.length} products`)

  // URL → media id cache, shared across the whole run to avoid re-uploading the
  // same image multiple times.
  const mediaCache = new Map<string, number>()

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
      description: 'Serbian brand of high-quality sports supplements.',
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
      const fallback = categoryIdBySlug.get('supplements')
      if (fallback) catIds.push(fallback)
    }

    // Build option label → id map for this product's variants (used to assign
    // each variation its catalog image).
    const optionsByLabel = new Map<string, { id: number; type: string }>()
    for (const v of p.variants) {
      const entry = vtMap.get(v.type)
      if (!entry) continue
      const optionId = entry.optionIdByLabel.get(v.name)
      if (optionId !== undefined) optionsByLabel.set(v.name, { id: optionId, type: v.type })
    }

    // Build the gallery from the image catalog, tagging each variation's image
    // with its variantOption so the storefront shows the right image per choice.
    const galleryItems = await buildProductGallery({
      payload,
      req,
      title: p.title,
      optionsByLabel,
      fallbackImages: p.images,
      catalog,
      mediaCache,
    })
    const taggedCount = galleryItems.filter((g) => g.variantOption?.length).length
    payload.logger.info(`    ${galleryItems.length} gallery images (${taggedCount} variant-tagged)`)

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
    //     e.g. flavor×size or size×color
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
  const req = await createLocalReq({ locale: 'en' }, payload)
  req.context = { ...req.context, disableRevalidate: true }
  await seedBasicSupplements({ payload, req })
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
