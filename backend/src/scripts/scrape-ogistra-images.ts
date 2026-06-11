/**
 * Scrape per-variation product images from the Ogistra (PrestaShop) shop.
 *
 * For each product found in the "basic supplements" search (pages 1–8) it reads
 * the embedded `data-product` JSON and the variant radios, then calls the
 * PrestaShop combination-refresh AJAX endpoint once per variant option to get
 * the exact images shown for that option (flavour/colour/etc.). The result is a
 * mapping file `ogistra_images.json` consumed by the seed.
 *
 * Resumable: products already present in the output file are skipped.
 *
 * Usage:  pnpm tsx src/scripts/scrape-ogistra-images.ts
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BASE = 'https://www.ogistra-nutrition-shop.com'
const SEARCH = `${BASE}/pretraga?order=product.position.desc&s=basic+supplements`
const PAGES = 8
const DELAY_MS = 200
const OUT_PATH = resolve(__dirname, '../../ogistra_images.json')
const IMAGES_DIR = resolve(__dirname, '../../scrape-images')
const DOWNLOAD = process.argv.includes('--download')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface VariantOption {
  attrId: number
  name: string
  group: number
  comboId: number | null
  images: string[]
}
interface VariantGroup {
  id: number
  label: string
  options: VariantOption[]
}
interface ScrapedProduct {
  id: number
  name: string
  slug: string
  manufacturer: string
  defaultImages: string[]
  groups: VariantGroup[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#0?34;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

async function fetchText(url: string, asJson = false): Promise<string | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) image-sync-bot',
          ...(asJson ? { 'X-Requested-With': 'XMLHttpRequest' } : {}),
        },
      })
      if (!res.ok) {
        await sleep(500)
        continue
      }
      return await res.text()
    } catch {
      await sleep(700)
    }
  }
  return null
}

const LARGE_IMG_RE = /https:\/\/www\.ogistra-nutrition-shop\.com\/\d+-large_default\/[^"'\\ )]+\.jpg/g

function extractLargeImages(html: string): string[] {
  const found = html.match(LARGE_IMG_RE) ?? []
  return [...new Set(found)]
}

// Product links from a search results page (dedup by product id).
function extractProductLinks(html: string): { id: number; url: string }[] {
  const out = new Map<number, string>()
  const re = /href="(https:\/\/www\.ogistra-nutrition-shop\.com\/[a-z0-9-]+\/(\d+)[^"]*\.html)[^"]*"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const url = m[1]
    const id = Number(m[2])
    if (!out.has(id)) out.set(id, url)
  }
  return [...out.entries()].map(([id, url]) => ({ id, url }))
}

interface DataProduct {
  id_product: number
  name: string
  link_rewrite: string
  manufacturer_name?: string
  images?: { bySize?: { large_default?: { url?: string } } }[]
}

function parseDataProduct(html: string): DataProduct | null {
  const m = html.match(/id="product-details"[^>]*\sdata-product="([^"]*)"/)
  if (!m) return null
  try {
    return JSON.parse(decodeEntities(m[1])) as DataProduct
  } catch {
    return null
  }
}

// Variant groups from the product page radios.
function parseGroups(html: string): VariantGroup[] {
  const groups = new Map<number, VariantGroup>()

  // Label per group: each "product-variants-item" block has a control-label and a <ul id="group_X">.
  const blocks = html.split('product-variants-item').slice(1)
  const labelByGroup = new Map<number, string>()
  for (const block of blocks) {
    const gid = block.match(/id="group_(\d+)"/)
    if (!gid) continue
    const label = block.match(/control-label">\s*([^<:]+?)\s*:/)
    labelByGroup.set(Number(gid[1]), label ? label[1].trim() : `group ${gid[1]}`)
  }

  const re =
    /name="group\[(\d+)\]"\s+value="(\d+)"\s+title="([^"]*)"(\s+checked="checked")?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const groupId = Number(m[1])
    const attrId = Number(m[2])
    const name = decodeEntities(m[3]).trim()
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        label: labelByGroup.get(groupId) ?? `group ${groupId}`,
        options: [],
      })
    }
    groups.get(groupId)!.options.push({ attrId, name, group: groupId, comboId: null, images: [] })
  }
  return [...groups.values()]
}

function defaultAttrFor(group: VariantGroup): number {
  return group.options[0]?.attrId
}

async function getComboImages(
  productUrl: string,
  productId: number,
  selections: Record<number, number>,
): Promise<{ comboId: number | null; images: string[] }> {
  const base = productUrl.split('#')[0]
  const params = new URLSearchParams()
  for (const [gid, attr] of Object.entries(selections)) params.append(`group[${gid}]`, String(attr))
  params.append('id_product', String(productId))
  params.append('ajax', '1')
  params.append('action', 'refresh')
  params.append('quantity_wanted', '1')
  const url = `${base}?${params.toString()}`
  const text = await fetchText(url, true)
  if (!text) return { comboId: null, images: [] }
  try {
    const data = JSON.parse(text)
    const html = (data.product_cover_thumbnails || '') + (data.product_images_modal || '')
    return { comboId: data.id_product_attribute ? Number(data.id_product_attribute) : null, images: extractLargeImages(html) }
  } catch {
    return { comboId: null, images: [] }
  }
}

async function scrapeProduct(url: string): Promise<ScrapedProduct | null> {
  const html = await fetchText(url)
  if (!html) return null
  const dp = parseDataProduct(html)
  if (!dp) return null

  const manufacturer = dp.manufacturer_name ?? ''
  const defaultImages = (dp.images ?? [])
    .map((i) => i?.bySize?.large_default?.url)
    .filter((u): u is string => Boolean(u))

  const groups = parseGroups(html)

  // For each option in each group, resolve its images via the combination AJAX,
  // holding the other groups at their default option.
  for (const group of groups) {
    for (const option of group.options) {
      const selections: Record<number, number> = {}
      for (const g of groups) selections[g.id] = defaultAttrFor(g)
      selections[group.id] = option.attrId
      const { comboId, images } = await getComboImages(url, dp.id_product, selections)
      option.comboId = comboId
      option.images = images.length ? images : defaultImages
      await sleep(DELAY_MS)
    }
  }

  return {
    id: dp.id_product,
    name: dp.name,
    slug: dp.link_rewrite,
    manufacturer,
    defaultImages,
    groups,
  }
}

async function downloadImages(products: Record<string, ScrapedProduct>) {
  if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true })
  const urls = new Set<string>()
  for (const p of Object.values(products)) {
    p.defaultImages.forEach((u) => urls.add(u))
    p.groups.forEach((g) => g.options.forEach((o) => o.images.forEach((u) => urls.add(u))))
  }
  console.log(`Downloading ${urls.size} unique images → ${IMAGES_DIR}`)
  let done = 0
  for (const url of urls) {
    const name = url.split('/').slice(-2).join('_')
    const dest = join(IMAGES_DIR, name)
    if (existsSync(dest)) {
      done++
      continue
    }
    try {
      const res = await fetch(url)
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        writeFileSync(dest, buf)
      }
    } catch {
      /* skip */
    }
    done++
    if (done % 25 === 0) console.log(`  ${done}/${urls.size}`)
    await sleep(80)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const result: Record<string, ScrapedProduct> = existsSync(OUT_PATH)
    ? JSON.parse(readFileSync(OUT_PATH, 'utf-8'))
    : {}

  // 1. Collect product links across all search pages.
  const links = new Map<number, string>()
  for (let page = 1; page <= PAGES; page++) {
    const url = page === 1 ? SEARCH : `${SEARCH}&page=${page}`
    const html = await fetchText(url)
    if (!html) {
      console.warn(`page ${page}: fetch failed`)
      continue
    }
    const found = extractProductLinks(html)
    found.forEach((f) => links.set(f.id, f.url))
    console.log(`page ${page}: ${found.length} products (total ${links.size})`)
    await sleep(DELAY_MS)
  }

  // 2. Scrape each product (skip already done).
  let i = 0
  for (const [id, url] of links) {
    i++
    if (result[id]) {
      console.log(`[${i}/${links.size}] skip ${id} (done)`)
      continue
    }
    const product = await scrapeProduct(url)
    if (!product) {
      console.warn(`[${i}/${links.size}] ${id}: parse failed`)
      continue
    }
    if (!/basic\s*supplements/i.test(product.manufacturer) && !/basic\s*supplements/i.test(product.name)) {
      console.log(`[${i}/${links.size}] ${id}: skip (not Basic Supplements — ${product.manufacturer})`)
      continue
    }
    result[id] = product
    writeFileSync(OUT_PATH, JSON.stringify(result, null, 2))
    const variants = product.groups.reduce((s, g) => s + g.options.length, 0)
    console.log(`[${i}/${links.size}] ${id}: ${product.name.slice(0, 40)} — ${product.groups.length} groups, ${variants} options`)
    await sleep(DELAY_MS)
  }

  console.log(`\nSaved ${Object.keys(result).length} products → ${OUT_PATH}`)
  if (DOWNLOAD) await downloadImages(result)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
