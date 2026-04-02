/**
 * Re-scrapes clothing products from ogistra-nutrition-shop.com
 * to extract BOTH size (group_1) and color (group_2) variants,
 * then patches products_scraped.json in-place.
 *
 * Run: node scrape-clothing-colors.mjs
 */

import { readFileSync, writeFileSync } from 'fs'

const JSON_PATH = './products_scraped.json'
const DELAY_MS = 800

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// Clothing category paths — products with these will be re-scraped
const CLOTHING_CATEGORY_KEYWORDS = [
  'SPORTSKA GARDEROBA',
  'BB I FITNESS OPREMA',
  'GARDEROBA',
]

function isClothing(product) {
  return product.categoryPath.some((c) =>
    CLOTHING_CATEGORY_KEYWORDS.includes(c.toUpperCase().trim()),
  )
}

async function scrapeVariants(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} for ${url}`)
      return null
    }
    const html = await res.text()

    const variants = []
    const seen = new Set()

    // PrestaShop uses radio inputs:
    //   <input class="input-radio" ... name="group[N]" title="M"> → veličina
    //   <input class="input-color" ... name="group[N]" title="Bež"> → boja

    // Sizes: input-radio
    const radioRegex = /<input[^>]+class="input-radio"[^>]+title="([^"]+)"[^>]*>/gi
    let m
    while ((m = radioRegex.exec(html)) !== null) {
      const name = m[1].trim()
      const key = `veličina:${name}`
      if (!seen.has(key)) {
        seen.add(key)
        variants.push({ name, type: 'veličina', inStock: true })
      }
    }

    // Colors: input-color
    const colorRegex = /<input[^>]+class="input-color"[^>]+title="([^"]+)"[^>]*>/gi
    while ((m = colorRegex.exec(html)) !== null) {
      const name = m[1].trim()
      const key = `boja:${name}`
      if (!seen.has(key)) {
        seen.add(key)
        variants.push({ name, type: 'boja', inStock: true })
      }
    }

    // Fallback: <select> elements (older PrestaShop themes)
    if (variants.length === 0) {
      const selectRegex =
        /<select[^>]+name="group_(\d+)"[^>]*(?:data-attribute-name="([^"]*)")?[^>]*>([\s\S]*?)<\/select>/gi
      let sm
      while ((sm = selectRegex.exec(html)) !== null) {
        const groupNum = parseInt(sm[1])
        const attrName = (sm[2] ?? '').toLowerCase()
        const type =
          attrName.includes('boja') || attrName.includes('color')
            ? 'boja'
            : attrName.includes('ukus') || attrName.includes('flavor')
              ? 'ukus'
              : 'veličina'
        const opts = sm[3]
        const optRe = /<option\s+value="\d+"[^>]*>([^<]+)<\/option>/gi
        let om
        while ((om = optRe.exec(opts)) !== null) {
          const name = om[1].replace(/<[^>]+>/g, '').trim()
          if (!name || name.startsWith('--') || name.includes(':')) continue
          const key = `${type}:${name}`
          if (!seen.has(key)) {
            seen.add(key)
            variants.push({ name, type, inStock: true })
          }
        }
      }
    }

    return variants.length > 0 ? variants : null
  } catch (err) {
    console.error(`  Error fetching ${url}: ${err.message}`)
    return null
  }
}

async function main() {
  const products = JSON.parse(readFileSync(JSON_PATH, 'utf-8'))
  const clothing = products.filter(isClothing)

  console.log(`Found ${clothing.length} clothing products to re-scrape\n`)

  let updated = 0
  let failed = 0

  for (let i = 0; i < clothing.length; i++) {
    const p = clothing[i]
    process.stdout.write(`[${i + 1}/${clothing.length}] ${p.title.substring(0, 60)}... `)

    await sleep(DELAY_MS)

    const freshVariants = await scrapeVariants(p.url)

    if (!freshVariants) {
      console.log('SKIP (no variants found)')
      failed++
      continue
    }

    // Find and update matching product in main array
    const idx = products.findIndex((x) => x.slug === p.slug)
    if (idx !== -1) {
      products[idx].variants = freshVariants
      const types = [...new Set(freshVariants.map((v) => v.type))]
      console.log(`OK — ${freshVariants.length} variants [${types.join(', ')}]`)
      updated++
    }
  }

  writeFileSync(JSON_PATH, JSON.stringify(products, null, 2))
  console.log(`\nDone. Updated: ${updated}, Failed/skipped: ${failed}`)
  console.log(`Saved to ${JSON_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
