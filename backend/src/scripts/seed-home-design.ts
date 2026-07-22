/**
 * seed-home-design.ts
 *
 * Seeds ONLY the "Home Hero" global (Split Hero + Product Spotlights) shown at
 * the top of the home page. It touches nothing else — not the home page layout,
 * not any other block. Safe to run any time; independent of seed-real-data.
 *
 * Run: pnpm seed:home
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import type { File } from 'payload'

// Edit here or later in the admin (Globals → Home Hero).
const HERO_PANELS = [
  {
    imageUrl: 'https://www.ogistra-nutrition-shop.com/3778-large_default/pro-whey-227kg-premium-whey-protein.jpg',
    eyebrow: 'Shop',
    title: 'Supplements',
    url: '/products/supplements',
  },
  {
    imageUrl: 'https://www.ogistra-nutrition-shop.com/3680-large_default/basic-duks-sa-kapuljacom-aerofit.jpg',
    eyebrow: 'Shop',
    title: 'Apparel',
    url: '/products/sports-clothing',
  },
]

const SPOTLIGHT_SUMMARY =
  'Premium, transparently formulated — made from carefully selected, quality-certified ingredients for reliable results you can feel.'

async function fetchFile(url: string): Promise<File | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg'
    const name = url.split('/').pop()?.split('?')[0] ?? `hero-${Date.now()}.${ext}`
    return { name, data: Buffer.from(data), mimetype: `image/${ext === 'jpg' ? 'jpeg' : ext}`, size: data.byteLength }
  } catch {
    return null
  }
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({ locale: 'en' }, payload)
  req.context = { ...req.context, disableRevalidate: true }

  payload.logger.info('=== Seed Home Hero global (Split Hero + Product Spotlights) ===')

  // 1. Split Hero — upload the two panel images.
  const panels: { image: number; eyebrow: string; title: string; url: string }[] = []
  for (const p of HERO_PANELS) {
    const file = await fetchFile(p.imageUrl)
    if (!file) {
      payload.logger.error(`  Hero image failed: ${p.imageUrl}`)
      continue
    }
    const media = await payload.create({ collection: 'media', data: { alt: `${p.title} hero` }, file, req })
    panels.push({ image: media.id, eyebrow: p.eyebrow, title: p.title, url: p.url })
  }
  const splitHero = panels.length >= 2 ? { blockType: 'splitHero', panels } : null
  if (!splitHero) payload.logger.warn('  Split Hero needs two images — skipping hero.')

  // 2. Product Spotlights — feature two real products.
  const found = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 2,
    depth: 0,
    sort: '-createdAt',
    req,
  })
  const spotlights = found.docs.map((p, i) => ({
    blockType: 'productSpotlight',
    eyebrow: 'Featured',
    product: p.id,
    summary: SPOTLIGHT_SUMMARY,
    imageSide: i % 2 === 0 ? 'right' : 'left',
    ctaLabel: 'Shop now',
  }))
  payload.logger.info(`  Prepared ${spotlights.length} product spotlight(s)`)

  const sections = [...(splitHero ? [splitHero] : []), ...spotlights]
  if (!sections.length) {
    payload.logger.error('  Nothing to seed — aborting.')
    return
  }

  // 3. Write ONLY the Home Hero global.
  await payload.updateGlobal({ slug: 'home-hero', data: { sections } as any, req })
  payload.logger.info(`  Saved Home Hero global (${sections.length} section(s)).`)

  payload.logger.info('=== Done ===')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
