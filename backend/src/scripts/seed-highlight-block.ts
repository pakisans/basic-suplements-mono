/**
 * seed-highlight-block.ts
 *
 * Adds (or refreshes) ONE `highlight` block on the HOME PAGE layout — the
 * seed.com-style cream panel with badge + heading + copy + CTA on one side and
 * a 1-large-plus-3-small image grid on the other.
 *
 * Non-destructive: every other block in the home layout is kept exactly as is.
 * If a `highlight` block already exists it is updated in place instead of a
 * second one being appended. Images are reused from existing product galleries
 * (nothing is uploaded, nothing is deleted).
 *
 * Run: pnpm seed:highlight
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

// Edit here, or afterwards in the admin (Pages → Home → Layout → Highlight).
const COPY = {
  badge: 'Bundle + Save 25%',
  heading: 'Daily essentials for strength and recovery.',
  body: 'Our premium whey protein paired with a daily multivitamin supports muscle recovery, covers nutrient gaps and keeps your training on track.',
  ctaLabel: 'Shop Daily Essentials',
  ctaUrl: '/products',
  variant: 'right' as const,
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({ locale: 'en' }, payload)
  req.context = { ...req.context, disableRevalidate: true }

  payload.logger.info('=== Seed Highlight block (home page) ===')

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 0,
    limit: 1,
    req,
  })
  if (found.docs.length === 0) {
    payload.logger.error('  No home page found — aborting.')
    return
  }
  const home = found.docs[0] as any

  // --- Images: one per product for variety, from what is already in the DB.
  const products = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 12,
    depth: 0,
    sort: '-createdAt',
    req,
  })

  const imageIds: number[] = []
  for (const p of products.docs as any[]) {
    const first = (p.gallery ?? []).map((g: any) => g?.image).filter(Boolean)[0]
    const id = typeof first === 'object' ? first?.id : first
    if (id && !imageIds.includes(id)) imageIds.push(id)
    if (imageIds.length === 4) break
  }

  if (imageIds.length < 4) {
    const media = await payload.find({ collection: 'media', limit: 8, depth: 0, sort: '-createdAt', req })
    for (const m of media.docs as any[]) {
      if (!imageIds.includes(m.id)) imageIds.push(m.id)
      if (imageIds.length === 4) break
    }
  }

  if (imageIds.length === 0) {
    payload.logger.error('  No media found to fill the block — aborting.')
    return
  }
  payload.logger.info(`  Using media ids: ${imageIds.join(', ')}`)

  const block = {
    blockType: 'highlight',
    badge: COPY.badge,
    variant: COPY.variant,
    heading: COPY.heading,
    body: COPY.body,
    cta: { label: COPY.ctaLabel, url: COPY.ctaUrl },
    mainImage: imageIds[0],
    gallery: imageIds.slice(1, 4).map((image) => ({ image })),
  }

  const layout = [...((home.layout ?? []) as any[])]
  const existingIndex = layout.findIndex((b) => b?.blockType === 'highlight')
  if (existingIndex >= 0) {
    layout[existingIndex] = { ...layout[existingIndex], ...block }
    payload.logger.info(`  Updated existing highlight block at position ${existingIndex + 1}.`)
  } else {
    layout.push(block)
    payload.logger.info(`  Appended highlight block at position ${layout.length}.`)
  }

  // Pages has drafts enabled: ANY update without _status flips home to draft and
  // the whole page disappears from the public API. Always re-publish.
  await payload.update({
    collection: 'pages',
    id: home.id,
    data: { layout, _status: 'published' } as any,
    req,
  })

  payload.logger.info(`  Home re-published with ${layout.length} block(s).`)
  payload.logger.info('=== Done ===')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
