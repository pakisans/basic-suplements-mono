/**
 * WooCommerce → Payload CMS Product Importer
 *
 * Usage:
 *   pnpm tsx src/scripts/import-wc.ts /path/to/wc-export.csv
 *
 * Options (env vars):
 *   IMPORT_LIMIT=50          Import only first N products (useful for testing)
 *   IMPORT_IMAGES=false      Skip image downloads (faster, no media)
 *   IMPORT_CONCURRENCY=3     Max concurrent image downloads (default: 3)
 *   IMPORT_SKIP_EXISTING=true  Skip products whose slug already exists (default: true)
 */

import config from '@payload-config'
import * as fs from 'fs'
import type { File } from 'payload'
import { getPayload } from 'payload'

// ─── Types ────────────────────────────────────────────────────────────────────

type WCRow = {
  id: string
  type: string
  sku: string
  name: string
  published: string
  isFeatured: string
  visibility: string
  shortDescription: string
  description: string
  salePriceStartDate: string
  salePriceEndDate: string
  taxStatus: string
  taxClass: string
  inStock: string
  stock: string
  lowStockAmount: string
  backordersAllowed: string
  soldIndividually: string
  weight: string
  length: string
  width: string
  height: string
  allowReviews: string
  purchaseNote: string
  salePrice: string
  regularPrice: string
  categories: string
  tags: string
  shippingClass: string
  images: string
  downloadLimit: string
  downloadExpiryDays: string
  parent: string
  groupedProducts: string
  upsells: string
  crossSells: string
  externalUrl: string
  buttonText: string
  position: string
  swatchesAttributes: string
  brands: string
  [key: string]: string
}

// ─── CSV Parser (full RFC 4180 compliant) ────────────────────────────────────

function parseCSV(content: string): WCRow[] {
  const lines: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0

  // Normalize line endings
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  while (i < text.length) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          // Escaped double-quote
          field += '"'
          i += 2
          continue
        } else {
          // End of quoted field
          inQuotes = false
          i++
          continue
        }
      }
      field += ch
      i++
    } else {
      if (ch === '"') {
        inQuotes = true
        i++
      } else if (ch === ',') {
        row.push(field)
        field = ''
        i++
      } else if (ch === '\n') {
        row.push(field)
        field = ''
        lines.push(row)
        row = []
        i++
      } else {
        field += ch
        i++
      }
    }
  }

  // Last field / row
  if (field || row.length > 0) {
    row.push(field)
    lines.push(row)
  }

  if (lines.length < 2) return []

  const headers = lines[0]
  const rows: WCRow[] = []

  for (let r = 1; r < lines.length; r++) {
    const cols = lines[r]
    if (cols.length === 1 && cols[0] === '') continue // skip empty lines

    const obj: WCRow = {
      id: '',
      type: '',
      sku: '',
      name: '',
      published: '',
      isFeatured: '',
      visibility: '',
      shortDescription: '',
      description: '',
      salePriceStartDate: '',
      salePriceEndDate: '',
      taxStatus: '',
      taxClass: '',
      inStock: '',
      stock: '',
      lowStockAmount: '',
      backordersAllowed: '',
      soldIndividually: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      allowReviews: '',
      purchaseNote: '',
      salePrice: '',
      regularPrice: '',
      categories: '',
      tags: '',
      shippingClass: '',
      images: '',
      downloadLimit: '',
      downloadExpiryDays: '',
      parent: '',
      groupedProducts: '',
      upsells: '',
      crossSells: '',
      externalUrl: '',
      buttonText: '',
      position: '',
      swatchesAttributes: '',
      brands: '',
    }

    // Map by header name
    const headerMap: Record<string, keyof WCRow> = {
      ID: 'id',
      Type: 'type',
      SKU: 'sku',
      Name: 'name',
      Published: 'published',
      'Is featured?': 'isFeatured',
      'Visibility in catalog': 'visibility',
      'Short description': 'shortDescription',
      Description: 'description',
      'Date sale price starts': 'salePriceStartDate',
      'Date sale price ends': 'salePriceEndDate',
      'Tax status': 'taxStatus',
      'Tax class': 'taxClass',
      'In stock?': 'inStock',
      Stock: 'stock',
      'Low stock amount': 'lowStockAmount',
      'Backorders allowed?': 'backordersAllowed',
      'Sold individually?': 'soldIndividually',
      'Weight (kg)': 'weight',
      'Length (cm)': 'length',
      'Width (cm)': 'width',
      'Height (cm)': 'height',
      'Allow customer reviews?': 'allowReviews',
      'Purchase note': 'purchaseNote',
      'Sale price': 'salePrice',
      'Regular price': 'regularPrice',
      Categories: 'categories',
      Tags: 'tags',
      'Shipping class': 'shippingClass',
      Images: 'images',
      'Download limit': 'downloadLimit',
      'Download expiry days': 'downloadExpiryDays',
      Parent: 'parent',
      'Grouped products': 'groupedProducts',
      Upsells: 'upsells',
      'Cross-sells': 'crossSells',
      'External URL': 'externalUrl',
      'Button text': 'buttonText',
      Position: 'position',
      'Swatches Attributes': 'swatchesAttributes',
      Brands: 'brands',
    }

    for (let c = 0; c < headers.length; c++) {
      const header = headers[c]
      const value = cols[c] ?? ''
      const key = headerMap[header]
      if (key) {
        obj[key] = value.trim()
      } else {
        // Store extra columns with original header name
        obj[header] = value.trim()
      }
    }

    rows.push(obj)
  }

  return rows
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[åà]/g, 'a')
    .replace(/[äæ]/g, 'a')
    .replace(/[öø]/g, 'o')
    .replace(/[é]/g, 'e')
    .replace(/[ü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

function parsePrice(raw: string): number {
  if (!raw || raw.trim() === '') return 0
  // Remove any non-numeric chars except comma/dot, handle Swedish decimal (comma)
  const cleaned = raw.replace(/[^0-9,.]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : Math.round(num)
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Convert basic HTML to Lexical JSON structure.
 * Handles: h2/h3/h4, p, ul/li, strong/em/b/i, br.
 * Fallback: wraps everything in a single paragraph.
 */
function htmlToLexical(html: string): object {
  if (!html || html.trim() === '') {
    return makeEmptyLexical()
  }

  // Normalize line breaks
  const normalized = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<li[^>]*>/gi, '• ')

  // Extract paragraphs/headings by splitting on \n
  const segments = normalized
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const children: object[] = []

  for (const segment of segments) {
    // Check for headings
    const h2Match = segment.match(/<h2[^>]*>(.*?)<\/h2>/i)
    const h3Match = segment.match(/<h3[^>]*>(.*?)<\/h3>/i)
    const h4Match = segment.match(/<h4[^>]*>(.*?)<\/h4>/i)

    if (h2Match) {
      const text = stripHtml(h2Match[1])
      if (text) children.push(makeHeading('h2', text))
      continue
    }
    if (h3Match) {
      const text = stripHtml(h3Match[1])
      if (text) children.push(makeHeading('h3', text))
      continue
    }
    if (h4Match) {
      const text = stripHtml(h4Match[1])
      if (text) children.push(makeHeading('h4', text))
      continue
    }

    // Strip inline HTML, preserve bold/italic markers
    const text = stripHtml(segment)
    if (!text) continue

    // Check for remaining HTML tags that indicate headings
    if (/<h[1-6]/.test(segment)) {
      const cleanText = stripHtml(segment)
      if (cleanText) children.push(makeHeading('h2', cleanText))
      continue
    }

    children.push(makeParagraph(text))
  }

  if (children.length === 0) {
    return makeEmptyLexical()
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function makeEmptyLexical(): object {
  return {
    root: {
      type: 'root',
      children: [makeParagraph('')],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function makeParagraph(text: string): object {
  return {
    type: 'paragraph',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    children: text
      ? [{ type: 'text', text, version: 1, detail: 0, format: 0, mode: 'normal', style: '' }]
      : [],
  }
}

function makeHeading(tag: 'h2' | 'h3' | 'h4', text: string): object {
  return {
    type: 'heading',
    tag,
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: [{ type: 'text', text, version: 1, detail: 0, format: 0, mode: 'normal', style: '' }],
  }
}

async function downloadImage(url: string): Promise<File | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15_000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PayloadImport/1.0)' },
    })
    if (!res.ok) return null

    const data = await res.arrayBuffer()
    const ext = url.split('.').pop()?.toLowerCase().split('?')[0] ?? 'jpg'
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    }
    const mimetype = mimeMap[ext] ?? 'image/jpeg'
    const name = url.split('/').pop()?.split('?')[0] ?? `img-${Date.now()}.jpg`

    return { name, data: Buffer.from(data), mimetype, size: data.byteLength }
  } catch {
    return null
  }
}

/**
 * Simple concurrency pool: run up to `max` tasks at a time.
 */
async function runConcurrent<T>(tasks: (() => Promise<T>)[], max: number): Promise<T[]> {
  const results: T[] = []
  let idx = 0

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      results[i] = await tasks[i]()
    }
  }

  const workers = Array.from({ length: Math.min(max, tasks.length) }, () => worker())
  await Promise.all(workers)
  return results
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = process.argv[2]
  if (!csvPath) {
    console.error('Usage: pnpm tsx src/scripts/import-wc.ts <csv-path>')
    process.exit(1)
  }
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    process.exit(1)
  }

  const LIMIT = process.env.IMPORT_LIMIT ? parseInt(process.env.IMPORT_LIMIT) : undefined
  const SKIP_IMAGES = process.env.IMPORT_IMAGES === 'false'
  const CONCURRENCY = parseInt(process.env.IMPORT_CONCURRENCY ?? '3')
  const SKIP_EXISTING = process.env.IMPORT_SKIP_EXISTING !== 'false'

  console.log('🚀 Initializing Payload...')
  const payload = await getPayload({ config })

  console.log('📄 Parsing CSV...')
  const content = fs.readFileSync(csvPath, 'utf-8')
  const allRows = parseCSV(content)

  // Filter to parent products only (simple + variable)
  let products = allRows.filter(
    (r) => r.type === 'simple' || r.type === 'variable' || r.type === 'variable, virtual',
  )

  // Skip products without a name
  products = products.filter((r) => r.name && r.name.trim())

  if (LIMIT) {
    products = products.slice(0, LIMIT)
    console.log(`⚙️  Limit: ${LIMIT} products`)
  }

  console.log(`📦 Found ${products.length} products to import`)

  // ── Phase 1: Collect unique categories, brands, tags ──────────────────────

  console.log('\n📂 Phase 1: Collecting categories, brands, tags...')

  const categoryPaths = new Set<string>()
  const brandNames = new Set<string>()
  const tagNames = new Set<string>()

  for (const row of products) {
    // Categories: "Parent > Child > Grandchild, Other Category"
    if (row.categories) {
      for (const catPath of row.categories.split(',')) {
        const path = catPath.trim()
        if (path) {
          categoryPaths.add(path)
          // Also add all ancestor paths
          const parts = path.split('>').map((p) => p.trim())
          for (let i = 1; i < parts.length; i++) {
            categoryPaths.add(parts.slice(0, i).join(' > '))
          }
        }
      }
    }

    if (row.brands && row.brands.trim()) {
      for (const b of row.brands.split(',')) {
        const name = b.trim()
        if (name) brandNames.add(name)
      }
    }

    if (row.tags) {
      for (const t of row.tags.split(',')) {
        const name = t.trim()
        if (name) tagNames.add(name)
      }
    }
  }

  console.log(
    `   Categories: ${categoryPaths.size} paths | Brands: ${brandNames.size} | Tags: ${tagNames.size}`,
  )

  // ── Phase 2: Create Categories ────────────────────────────────────────────

  console.log('\n📂 Phase 2: Creating categories...')

  // Category map: full path → Payload ID
  const categoryMap = new Map<string, number>()

  // Sort paths so parents come before children (shorter paths first)
  const sortedPaths = Array.from(categoryPaths).sort(
    (a, b) => a.split('>').length - b.split('>').length,
  )

  for (const path of sortedPaths) {
    const parts = path.split('>').map((p) => p.trim())
    const title = parts[parts.length - 1]
    const parentPath = parts.length > 1 ? parts.slice(0, -1).join(' > ') : null
    const parentId = parentPath ? categoryMap.get(parentPath) : undefined

    const slug = slugify(title)

    // Check if exists
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap.set(path, existing.docs[0].id as number)
      process.stdout.write('.')
      continue
    }

    try {
      const created = await payload.create({
        collection: 'categories',
        data: {
          title,
          slug,
          ...(parentId ? { parent: parentId } : {}),
        },
      })
      categoryMap.set(path, created.id as number)
      process.stdout.write('+')
    } catch (err) {
      console.warn(`\n   ⚠️ Category create failed "${title}": ${err}`)
    }
  }
  console.log(`\n   ✓ ${categoryMap.size} categories ready`)

  // ── Phase 3: Create Brands ────────────────────────────────────────────────

  console.log('\n🏷️  Phase 3: Creating brands...')
  const brandMap = new Map<string, number>()

  for (const name of brandNames) {
    const slug = slugify(name)

    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      brandMap.set(name, existing.docs[0].id as number)
      process.stdout.write('.')
      continue
    }

    try {
      const created = await payload.create({
        collection: 'brands',
        data: { title: name, slug },
      })
      brandMap.set(name, created.id as number)
      process.stdout.write('+')
    } catch (err) {
      console.warn(`\n   ⚠️ Brand create failed "${name}": ${err}`)
    }
  }
  console.log(`\n   ✓ ${brandMap.size} brands ready`)

  // ── Phase 4: Create Tags ──────────────────────────────────────────────────

  console.log('\n🔖 Phase 4: Creating tags...')
  const tagMap = new Map<string, number>()

  for (const name of tagNames) {
    const slug = slugify(name)

    const existing = await payload.find({
      collection: 'tags',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      tagMap.set(name, existing.docs[0].id as number)
      process.stdout.write('.')
      continue
    }

    try {
      const created = await payload.create({
        collection: 'tags',
        data: { title: name, slug },
      })
      tagMap.set(name, created.id as number)
      process.stdout.write('+')
    } catch (err) {
      console.warn(`\n   ⚠️ Tag create failed "${name}": ${err}`)
    }
  }
  console.log(`\n   ✓ ${tagMap.size} tags ready`)

  // ── Phase 5: Create Products ──────────────────────────────────────────────

  console.log('\n🛍️  Phase 5: Creating products...')

  let created = 0
  let skipped = 0
  let failed = 0
  const slugCount = new Map<string, number>()

  // Build a set of existing slugs for quick lookups
  const existingSlugsRes = await payload.find({
    collection: 'products',
    limit: 0,
    select: { slug: true },
  })
  const existingSlugs = new Set(existingSlugsRes.docs.map((d: any) => d.slug))

  for (let i = 0; i < products.length; i++) {
    const row = products[i]

    const productName = row.name.trim()

    // Generate unique slug
    let baseSlug = slugify(productName)
    if (!baseSlug) baseSlug = `product-${row.id}`

    const count = (slugCount.get(baseSlug) ?? 0) + 1
    slugCount.set(baseSlug, count)
    const productSlug = count === 1 ? baseSlug : `${baseSlug}-${count}`

    // Skip if already exists
    if (SKIP_EXISTING && existingSlugs.has(productSlug)) {
      skipped++
      if (i % 50 === 0) {
        process.stdout.write(
          `\r   [${i + 1}/${products.length}] created:${created} skipped:${skipped} failed:${failed}  `,
        )
      }
      continue
    }

    try {
      // ── Images ──────────────────────────────────────────────────────────

      const gallery: { image: number }[] = []

      if (!SKIP_IMAGES && row.images) {
        const imageUrls = row.images
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
          .slice(0, 6) // max 6 images per product

        const imageTasks = imageUrls.map((url) => async () => {
          // Check if media with this filename already exists
          const filename = url.split('/').pop()?.split('?')[0] ?? ''
          if (filename) {
            const existing = await payload.find({
              collection: 'media',
              where: { filename: { equals: filename } },
              limit: 1,
            })
            if (existing.docs.length > 0) {
              return existing.docs[0].id as number
            }
          }

          const file = await downloadImage(url)
          if (!file) return null

          try {
            const media = await payload.create({
              collection: 'media',
              data: { alt: productName },
              file,
            })
            return media.id as number
          } catch {
            return null
          }
        })

        const imageIds = await runConcurrent(imageTasks, CONCURRENCY)

        for (const id of imageIds) {
          if (id !== null) {
            gallery.push({ image: id })
          }
        }
      }

      // ── Price ────────────────────────────────────────────────────────────

      const price = parsePrice(row.regularPrice)
      const salePrice = parsePrice(row.salePrice)

      // ── Categories ───────────────────────────────────────────────────────

      const categoryIds: number[] = []
      if (row.categories) {
        for (const catPath of row.categories.split(',')) {
          const path = catPath.trim()
          const id = categoryMap.get(path)
          if (id && !categoryIds.includes(id as number)) categoryIds.push(id as number)
        }
      }

      // ── Brand ─────────────────────────────────────────────────────────────

      let brandId: number | undefined
      if (row.brands) {
        const firstBrand = row.brands.split(',')[0].trim()
        const found = brandMap.get(firstBrand)
        if (found) brandId = found as number
      }

      // ── Tags ──────────────────────────────────────────────────────────────

      const tagIds: number[] = []
      if (row.tags) {
        for (const t of row.tags.split(',')) {
          const name = t.trim()
          const id = tagMap.get(name)
          if (id && !tagIds.includes(id as number)) tagIds.push(id as number)
        }
      }

      // ── Status ───────────────────────────────────────────────────────────

      // ── Description ──────────────────────────────────────────────────────

      const descriptionLexical = row.description
        ? htmlToLexical(row.description)
        : makeEmptyLexical()

      // ── Create Product ───────────────────────────────────────────────────
      // Always create as published so data lands in the main table
      // (draft:true puts data only in versions table → admin list shows empty title).
      // Gallery is omitted when empty because minRows:1 would fail validation.

      await payload.create({
        collection: 'products',
        data: {
          title: productName,
          slug: productSlug,
          _status: 'published',
          description: descriptionLexical as any,
          ...(gallery.length > 0 ? { gallery } : {}),
          layout: [] as any[],
          price: price > 0 ? price : 0,
          ...(salePrice > 0 ? { salePrice } : {}),
          categories: categoryIds,
          ...(brandId ? { brand: brandId } : {}),
          tags: tagIds,
          priceInUSDEnabled: false,
          priceInUSD: 0,
          meta: {
            title: productName,
            description: row.shortDescription ? stripHtml(row.shortDescription).slice(0, 160) : '',
          },
        },
      })

      created++
      existingSlugs.add(productSlug)
    } catch (err) {
      failed++
      console.warn(`\n   ⚠️ Product failed "${productName}": ${err}`)
    }

    if ((i + 1) % 10 === 0 || i === products.length - 1) {
      process.stdout.write(
        `\r   [${i + 1}/${products.length}] created:${created} skipped:${skipped} failed:${failed}  `,
      )
    }
  }

  console.log(`\n\n✅ Import complete!`)
  console.log(`   Created:  ${created}`)
  console.log(`   Skipped:  ${skipped} (already existed)`)
  console.log(`   Failed:   ${failed}`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
