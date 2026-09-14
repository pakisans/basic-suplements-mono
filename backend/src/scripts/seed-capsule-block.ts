/**
 * seed-capsule-block.ts
 *
 * Adds (or refreshes) ONE `capsuleTech` block on the HOME PAGE layout — the
 * seed.com ViaCap-style section: photo background + frosted glass card, animated
 * label, heading, metric note card and a centered product visual with two
 * dotted-line annotations.
 *
 * Non-destructive: all other home blocks are kept as they are, and if a
 * `capsuleTech` block already exists it is updated in place (never duplicated).
 * Images are reused from existing product galleries — nothing is uploaded or
 * deleted. Swap the video/background afterwards in the admin.
 *
 * Run: pnpm seed:capsule
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

// Edit here, or afterwards in the admin (Pages → Home → Layout → Capsule Technology).
const COPY = {
  label: 'Micro-Filtered Technology',
  heading: "Most proteins lose their aminos in processing—ours don't.",
  note: {
    pill: 'PRO WHEY',
    title: 'Increases protein synthesis°',
    metric: '17',
    metricSuffix: 'x',
    arrow: 'up' as const,
  },
  disclaimer: '°Whey protein isolate',
  columns: [
    {
      title: 'Outer layer',
      text: 'Shields the protein from heat treatment during processing, while delivering enzymes that speed up absorption.',
    },
    {
      title: 'Inner core',
      text: 'Delivers 22 g of micro-filtered whey isolate to the muscle, where it is needed most.',
    },
  ],
}

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({ locale: 'en' }, payload)
  req.context = { ...req.context, disableRevalidate: true }

  payload.logger.info('=== Seed Capsule Technology block (home page) ===')

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
    if (imageIds.length === 2) break
  }

  if (imageIds.length < 2) {
    const media = await payload.find({ collection: 'media', limit: 8, depth: 0, sort: '-createdAt', req })
    for (const m of media.docs as any[]) {
      if (!imageIds.includes(m.id)) imageIds.push(m.id)
      if (imageIds.length === 2) break
    }
  }

  if (imageIds.length === 0) {
    payload.logger.error('  No media found to fill the block — aborting.')
    return
  }
  payload.logger.info(`  Using media ids: ${imageIds.join(', ')}`)

  const block = {
    blockType: 'capsuleTech',
    backgroundImage: imageIds[1] ?? imageIds[0],
    label: COPY.label,
    heading: COPY.heading,
    note: COPY.note,
    disclaimer: COPY.disclaimer,
    media: { image: imageIds[0] },
    columns: COPY.columns,
  }

  const layout = [...((home.layout ?? []) as any[])]
  const existingIndex = layout.findIndex((b) => b?.blockType === 'capsuleTech')
  if (existingIndex >= 0) {
    layout[existingIndex] = { ...layout[existingIndex], ...block }
    payload.logger.info(`  Updated existing capsuleTech block at position ${existingIndex + 1}.`)
  } else {
    layout.push(block)
    payload.logger.info(`  Appended capsuleTech block at position ${layout.length}.`)
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
