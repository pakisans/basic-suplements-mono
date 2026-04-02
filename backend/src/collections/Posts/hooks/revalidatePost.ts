import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Post } from '@/payload-types'

const safeRevalidatePath = (path: string, logger?: { warn: (message: string) => void }) => {
  try {
    revalidatePath(path)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('static generation store missing')) {
      logger?.warn(`Skipping revalidatePath for ${path} outside Next request context.`)
      return
    }

    throw error
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req }) => {
  if (!req.context.disableRevalidate) {
    if (doc._status === 'published') {
      safeRevalidatePath('/blog', req.payload.logger)
      safeRevalidatePath(`/blog/${doc.slug}`, req.payload.logger)
    }

    if (previousDoc?._status === 'published' && previousDoc.slug !== doc.slug) {
      safeRevalidatePath(`/blog/${previousDoc.slug}`, req.payload.logger)
    }
  }

  return doc
}

export const revalidatePostDelete: CollectionAfterDeleteHook<Post> = ({ doc, req }) => {
  if (!req.context.disableRevalidate && doc?.slug) {
    safeRevalidatePath('/blog', req.payload.logger)
    safeRevalidatePath(`/blog/${doc.slug}`, req.payload.logger)
  }

  return doc
}
