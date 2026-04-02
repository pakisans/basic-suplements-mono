import { payloadQuery, payloadFindBySlug } from '@/lib/payload/client'
import { REVALIDATE } from '@/constants'

export async function getBrands(limit = 50) {
  const result = await payloadQuery('brands', {
    sort: 'title',
    limit,
    depth: 2,
    revalidate: REVALIDATE.categories,
    tags: ['brands'],
  })

  return result.docs
}

export async function getBrandBySlug(slug) {
  return payloadFindBySlug('brands', slug, {
    depth: 3,
    revalidate: REVALIDATE.categories,
    tags: ['brands', `brand-${slug}`],
  })
}
