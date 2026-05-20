export const dynamic = 'force-dynamic'

import { getAllProductSlugs } from '@/services/products'
import { getAllCategorySlugs } from '@/services/categories'
import { getAllPageSlugs } from '@/services/pages'
import { SERVER_URL } from '@/constants'

function lm(dateStr) {
  return dateStr ? new Date(dateStr) : new Date()
}

export default async function sitemap() {
  const [productSlugs, categorySlugs, pageSlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllCategorySlugs(),
    getAllPageSlugs(),
  ])

  const now = new Date()

  const staticRoutes = [
    { url: SERVER_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SERVER_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]

  const pageRoutes = pageSlugs.map(({ slug, updatedAt }) => ({
    url: `${SERVER_URL}/${slug}`,
    lastModified: lm(updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const categoryRoutes = categorySlugs.map(({ slug, parentSlug, updatedAt }) => ({
    url: parentSlug
      ? `${SERVER_URL}/products/${parentSlug}/${slug}`
      : `${SERVER_URL}/products/${slug}`,
    lastModified: lm(updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productRoutes = productSlugs.map(({ slug, updatedAt }) => ({
    url: `${SERVER_URL}/products/${slug}`,
    lastModified: lm(updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...pageRoutes, ...categoryRoutes, ...productRoutes]
}
