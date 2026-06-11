/**
 * Seed the home page "Split Hero" block — two image panels with links, shown as
 * the first block on the home page. Non-destructive: it upserts the `home` page
 * and prepends (or replaces) the splitHero block, leaving the rest of the page
 * and all other data untouched. Editable afterwards in the admin.
 *
 * Usage:  pnpm tsx src/scripts/seed-home-hero.ts
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import type { File } from 'payload'

// Edit these to change the seeded panels (or just edit them later in the admin).
const PANELS = [
  {
    imageUrl: 'https://www.ogistra-nutrition-shop.com/3778-large_default/pro-whey-227kg-premium-whey-protein.jpg',
    eyebrow: 'Shop',
    title: 'Suplementi',
    url: '/products',
  },
  {
    imageUrl: 'https://www.ogistra-nutrition-shop.com/3680-large_default/basic-duks-sa-kapuljacom-aerofit.jpg',
    eyebrow: 'Shop',
    title: 'Oprema',
    url: '/products',
  },
]

async function fetchFile(url: string): Promise<File | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg'
    const name = url.split('/').pop()?.split('?')[0] ?? `split-hero-${Date.now()}.${ext}`
    return { name, data: Buffer.from(data), mimetype: `image/${ext === 'jpg' ? 'jpeg' : ext}`, size: data.byteLength }
  } catch {
    return null
  }
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  req.context = { ...req.context, disableRevalidate: true }

  payload.logger.info('=== Seed home Split Hero ===')

  // 1. Upload the two panel images.
  const panels: { image: number; eyebrow: string; title: string; url: string }[] = []
  for (const p of PANELS) {
    const file = await fetchFile(p.imageUrl)
    if (!file) {
      payload.logger.error(`  Image failed: ${p.imageUrl}`)
      continue
    }
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${p.title} hero` },
      file,
      req,
    })
    panels.push({ image: media.id, eyebrow: p.eyebrow, title: p.title, url: p.url })
    payload.logger.info(`  Uploaded panel image: ${p.title}`)
  }

  if (panels.length < 2) {
    payload.logger.error('  Need two panel images — aborting.')
    return
  }

  const splitHeroBlock = { blockType: 'splitHero', panels } as any

  // 2. Upsert the home page (depth 0 so existing relations come back as ids).
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 0,
    limit: 1,
    req,
  })

  if (existing.docs.length > 0) {
    const home = existing.docs[0] as any
    const rest = (home.layout ?? []).filter((b: any) => b?.blockType !== 'splitHero')
    await payload.update({
      collection: 'pages',
      id: home.id,
      data: { layout: [splitHeroBlock, ...rest] },
      req,
    })
    payload.logger.info(`  Updated home page (prepended Split Hero, kept ${rest.length} other block(s))`)
  } else {
    await payload.create({
      collection: 'pages',
      data: { slug: 'home', title: 'Pocetna', _status: 'published', layout: [splitHeroBlock] } as any,
      req,
    })
    payload.logger.info('  Created home page with Split Hero')
  }

  payload.logger.info('=== Done ===')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
