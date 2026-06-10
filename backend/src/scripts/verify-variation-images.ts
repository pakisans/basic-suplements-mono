import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { loadCatalog, planProductGallery } from './lib/catalog-images'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface ScrapedVariant { name: string; type: string }
interface ScrapedProduct { title: string; images: string[]; variants: ScrapedVariant[] }

for (const file of ['products_scraped.json', 'products_scraped_en.json']) {
  const path = resolve(__dirname, `../../${file}`)
  let products: ScrapedProduct[]
  try {
    products = JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    console.log(`\n(skip ${file} — not found)`)
    continue
  }
  const catalog = loadCatalog(resolve(__dirname, '../../products_catalog.csv'))

  let totalOptions = 0
  let coveredOptions = 0
  let productsWithoutGallery = 0
  let variantTagged = 0
  const problems: string[] = []

  let nextId = 1
  for (const p of products) {
    const optionsByLabel = new Map<string, { id: number; type: string }>()
    const idToLabel = new Map<number, string>()
    for (const v of p.variants) {
      if (!optionsByLabel.has(v.name)) {
        const id = nextId++
        optionsByLabel.set(v.name, { id, type: v.type })
        idToLabel.set(id, `${v.type}:${v.name}`)
      }
    }

    const plan = planProductGallery({
      title: p.title,
      optionsByLabel,
      fallbackImages: p.images,
      catalog,
    })

    if (plan.length === 0) {
      productsWithoutGallery++
      problems.push(`NO GALLERY: ${p.title}`)
    }
    if (plan.every((s) => s.url)) {
      /* every slot has a URL */
    } else {
      problems.push(`EMPTY URL slot: ${p.title}`)
    }

    const taggedIds = new Set<number>()
    for (const s of plan) for (const id of s.variantOption) taggedIds.add(id)
    variantTagged += plan.filter((s) => s.variantOption.length > 0).length

    for (const [label, { id }] of optionsByLabel) {
      totalOptions++
      if (taggedIds.has(id)) coveredOptions++
      else problems.push(`UNCOVERED option (no image): ${p.title} → ${idToLabel.get(id) ?? label}`)
    }
  }

  console.log(`\n===== ${file} =====`)
  console.log(`products:                 ${products.length}`)
  console.log(`products without gallery: ${productsWithoutGallery}`)
  console.log(`variant options:          ${totalOptions}`)
  console.log(`options with an image:    ${coveredOptions} (${((coveredOptions / totalOptions) * 100).toFixed(1)}%)`)
  console.log(`variant-tagged slots:     ${variantTagged}`)
  if (problems.length) {
    console.log(`PROBLEMS (${problems.length}):`)
    for (const p of problems.slice(0, 40)) console.log(`  - ${p}`)
  } else {
    console.log('No problems: every variation resolves to an image.')
  }
}
