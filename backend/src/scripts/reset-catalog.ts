/**
 * Hard reset of all catalog data — use to clear broken/orphaned records
 * (e.g. admin showing "The document with ID null could not be found" after an
 * interrupted seed). Deletes in a foreign-key-safe order: documents that
 * reference others go first, so nothing is left dangling.
 *
 * Destructive: removes ALL products, variants, categories, brands and media
 * (and the media files on disk). Back up first.
 *
 * Usage:  pnpm tsx src/scripts/reset-catalog.ts
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import { rmSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Order matters: children (referencing) → parents (referenced).
const CLEANUP_ORDER = [
  'variants',
  'products',
  'variantOptions',
  'variantTypes',
  'categories',
  'brands',
  'media',
] as const

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  req.context = { ...req.context, disableRevalidate: true }

  payload.logger.info('=== Catalog reset ===')
  for (const collection of CLEANUP_ORDER) {
    try {
      await payload.db.deleteMany({ collection, req, where: {} })
      payload.logger.info(`  Cleared: ${collection}`)
    } catch (err) {
      payload.logger.error(`  Failed to clear ${collection}: ${err}`)
    }
  }

  const mediaDir = resolve(__dirname, '../../../public/media')
  if (existsSync(mediaDir)) {
    for (const file of readdirSync(mediaDir)) {
      rmSync(join(mediaDir, file), { recursive: true, force: true })
    }
    payload.logger.info(`  Cleared media files from disk: ${mediaDir}`)
  }

  payload.logger.info('=== Reset complete ===')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
