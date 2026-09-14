/**
 * seed-science-block.ts
 *
 * Adds (or refreshes) ONE `scienceIntro` block on the HOME PAGE layout — the
 * seed.com Microbiome-101-style intro: cream section, brand mark in brackets,
 * big heading, copy, "Discover" pill with a play circle, a SCIENCE / … label at
 * the bottom and a large square visual (video, or an animated product image).
 *
 * Non-destructive: all other home blocks are kept as they are, and if a
 * `scienceIntro` block already exists it is updated in place (never duplicated).
 * The visual is reused from an existing product gallery image — nothing is
 * uploaded or deleted. Swap it for a real protein video in the admin afterwards.
 *
 * Run: pnpm seed:science
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

// Edit here, or afterwards in the admin (Pages → Home → Layout → Science Intro).
const COPY = {
  brandMark: 'Basic Supplements',
  heading: 'You are what you absorb.',
  body: 'Protein is only as good as what your body can actually use. Our micro-filtered whey isolate is built for absorption, not for the label — take a few minutes to learn how protein quality shapes your recovery.',
  ctaLabel: 'Discover',
  ctaUrl: '',
  footerLabel: 'SCIENCE /',
  footerTitle: 'Protein 101',
  mediaSide: 'right' as const,
  motion: 'zoom' as const,
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({ locale: 'en' }, payload)
  req.context = { ...req.context, disableRevalidate: true }

  payload.logger.info('=== Seed Science Intro block (home page) ===')

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

  // --- Visual: first gallery image of the newest published product.
  const products = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 12,
    depth: 0,
    sort: '-createdAt',
    req,
  })

  let imageId: number | null = null
  for (const p of products.docs as any[]) {
    const first = (p.gallery ?? []).map((g: any) => g?.image).filter(Boolean)[0]
    const id = typeof first === 'object' ? first?.id : first
    if (id) {
      imageId = id
      break
    }
  }

  if (!imageId) {
    const media = await payload.find({ collection: 'media', limit: 1, depth: 0, sort: '-createdAt', req })
    imageId = (media.docs[0] as any)?.id ?? null
  }

  if (!imageId) {
    payload.logger.error('  No media found to fill the block — aborting.')
    return
  }
  payload.logger.info(`  Using media id: ${imageId}`)

  const block = {
    blockType: 'scienceIntro',
    brandMark: COPY.brandMark,
    mediaSide: COPY.mediaSide,
    heading: COPY.heading,
    body: COPY.body,
    cta: { label: COPY.ctaLabel, url: COPY.ctaUrl },
    footer: { label: COPY.footerLabel, title: COPY.footerTitle },
    media: { image: imageId, motion: COPY.motion },
  }

  const layout = [...((home.layout ?? []) as any[])]
  const existingIndex = layout.findIndex((b) => b?.blockType === 'scienceIntro')
  if (existingIndex >= 0) {
    layout[existingIndex] = { ...layout[existingIndex], ...block }
    payload.logger.info(`  Updated existing scienceIntro block at position ${existingIndex + 1}.`)
  } else {
    layout.push(block)
    payload.logger.info(`  Appended scienceIntro block at position ${layout.length}.`)
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
