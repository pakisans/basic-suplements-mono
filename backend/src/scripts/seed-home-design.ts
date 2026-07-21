/**
 * seed-home-design.ts
 *
 * Adds the new home-page design blocks — a Split Hero (Supplements / Apparel)
 * and two Product Spotlights — to the home page WITHOUT overwriting the rest of
 * it. Kept separate from seed-real-data on purpose so re-running either one
 * doesn't clobber the other.
 *
 * Non-destructive: reads the existing home layout, removes any previous
 * splitHero / productSpotlight (and invalid blocks), then puts the hero first,
 * the spotlights next, and keeps every other existing block.
 *
 * Run: pnpm seed:home
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import type { File } from 'payload'

// Edit here or later in the admin (Pages → Home → Layout).
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

  payload.logger.info('=== Seed home design (Split Hero + Product Spotlights) ===')

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

  const designBlocks = [...(splitHero ? [splitHero] : []), ...spotlights] as any[]
  if (!designBlocks.length) {
    payload.logger.error('  Nothing to add — aborting.')
    return
  }

  // 3. Merge into the home page (depth 0 so existing relations are ids).
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 0,
    limit: 1,
    req,
  })

  const isInvalid = (b: any) =>
    (b?.blockType === 'mediaBlock' || b?.blockType === 'media') && !b?.media
  const isDesignBlock = (b: any) => b?.blockType === 'splitHero' || b?.blockType === 'productSpotlight'

  if (existing.docs.length > 0) {
    const home = existing.docs[0] as any
    const rest = (home.layout ?? []).filter((b: any) => !isDesignBlock(b) && !isInvalid(b))
    const layout = [...designBlocks, ...rest]

    const setLayout = (l: any[]) =>
      payload.update({ collection: 'pages', id: home.id, data: { layout: l }, req })

    try {
      await setLayout(layout)
      payload.logger.info(`  Updated home (hero + ${spotlights.length} spotlights, kept ${rest.length} other block(s))`)
    } catch (err) {
      payload.logger.warn(`  Existing layout still invalid (${err}); setting design blocks only`)
      await setLayout(designBlocks)
      payload.logger.info('  Updated home (design blocks only)')
    }
  } else {
    await payload.create({
      collection: 'pages',
      data: { slug: 'home', title: 'Home', _status: 'published', layout: designBlocks } as any,
      req,
    })
    payload.logger.info('  Created home page with design blocks')
  }

  payload.logger.info('=== Done ===')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
