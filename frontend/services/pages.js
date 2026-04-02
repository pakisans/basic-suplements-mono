import { payloadQuery, payloadFindBySlug } from '@/lib/payload/client'
import { REVALIDATE } from '@/constants'

export async function getPageBySlug(slug) {
  return payloadFindBySlug('pages', slug, {
    depth: 3,
    revalidate: REVALIDATE.pages,
    tags: ['pages', `page-${slug}`],
    where: { _status: { equals: 'published' } },
  })
}

export async function getHomePage() {
  return getPageBySlug('home')
}

export async function getAllPageSlugs() {
  const result = await payloadQuery('pages', {
    where: {
      _status: { equals: 'published' },
      slug: { not_equals: 'home' },
    },
    limit: 1000,
    depth: 0,
    revalidate: REVALIDATE.pages,
  })

  return result.docs.map((p) => ({ slug: p.slug }))
}
