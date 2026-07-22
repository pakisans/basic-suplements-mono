/**
 * clean-home-layout.ts
 *
 * One-off cleanup: remove any splitHero / productSpotlight blocks that were
 * previously seeded into the HOME PAGE layout (before they moved to the
 * Home Hero global). Those design blocks now live only in the global, so
 * leaving copies in the page layout renders them twice.
 *
 * Non-destructive to everything else: keeps all other blocks; only drops the
 * design blocks (and any invalid media block that would fail re-validation).
 *
 * Run: pnpm clean:home-blocks
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({ locale: 'en' }, payload)
  req.context = { ...req.context, disableRevalidate: true }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 0,
    limit: 1,
    req,
  })
  if (existing.docs.length === 0) {
    payload.logger.warn('No home page found — nothing to clean.')
    return
  }

  const home = existing.docs[0] as any
  const before = (home.layout ?? []) as any[]
  const isDesignBlock = (b: any) =>
    b?.blockType === 'splitHero' || b?.blockType === 'productSpotlight'
  const isInvalid = (b: any) =>
    (b?.blockType === 'mediaBlock' || b?.blockType === 'media') && !b?.media

  const after = before.filter((b) => !isDesignBlock(b) && !isInvalid(b))
  const removed = before.length - after.length

  if (removed === 0) {
    payload.logger.info('Home layout already clean — no design blocks to remove.')
    return
  }

  await payload.update({ collection: 'pages', id: home.id, data: { layout: after }, req })
  payload.logger.info(
    `Removed ${removed} block(s) from home layout (kept ${after.length}). Design blocks now live only in the Home Hero global.`,
  )
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
