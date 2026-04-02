export const dynamic = 'force-dynamic'

import { getAllProductSlugs } from '@/services/products'
import { getAllCategorySlugs } from '@/services/categories'
import { getAllPostSlugs } from '@/services/posts'
import { getAllPageSlugs } from '@/services/pages'
import { SERVER_URL } from '@/constants'

export default async function sitemap() {
  const [productSlugs, categorySlugs, postSlugs, pageSlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllCategorySlugs(),
    getAllPostSlugs(),
    getAllPageSlugs(),
  ])

  const lastModified = new Date()

  const staticRoutes = [
    { url: SERVER_URL, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${SERVER_URL}/proizvodi`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SERVER_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const pageRoutes = pageSlugs.map(({ slug }) => ({
    url: `${SERVER_URL}/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const categoryRoutes = categorySlugs.map(({ slug, parentSlug }) => ({
    url: parentSlug
      ? `${SERVER_URL}/proizvodi/${parentSlug}/${slug}`
      : `${SERVER_URL}/proizvodi/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productRoutes = productSlugs.map(({ slug }) => ({
    url: `${SERVER_URL}/proizvodi/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const postRoutes = postSlugs.map(({ slug }) => ({
    url: `${SERVER_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...pageRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes]
}
