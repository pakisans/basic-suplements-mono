import { payloadQuery, payloadFindBySlug } from '@/lib/payload/client'
import { REVALIDATE } from '@/constants'

const PREFERRED_PARENT_CATEGORY_ORDER = ['suplementi', 'oprema']

function sortParentCategories(categories) {
  return [...categories].sort((a, b) => {
    const aIndex = PREFERRED_PARENT_CATEGORY_ORDER.indexOf(a.slug)
    const bIndex = PREFERRED_PARENT_CATEGORY_ORDER.indexOf(b.slug)
    const normalizedAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex
    const normalizedBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex

    if (normalizedAIndex !== normalizedBIndex) {
      return normalizedAIndex - normalizedBIndex
    }

    return String(a.title).localeCompare(String(b.title), 'sr')
  })
}

export async function getCategories(options = {}) {
  const { parentOnly = false, limit = 100, depth = 2 } = options
  const where = {}

  if (parentOnly) {
    where.parent = { exists: false }
  }

  const result = await payloadQuery('categories', {
    where,
    sort: 'title',
    limit,
    depth,
    revalidate: REVALIDATE.categories,
    tags: ['categories'],
  })

  if (parentOnly) {
    return sortParentCategories(result.docs)
  }

  return result.docs
}

export async function getCategoryBySlug(slug) {
  return payloadFindBySlug('categories', slug, {
    depth: 3,
    revalidate: REVALIDATE.categories,
    tags: ['categories', `category-${slug}`],
  })
}

export async function getSubcategories(parentSlug) {
  const result = await payloadQuery('categories', {
    where: {
      'parent.slug': { equals: parentSlug },
    },
    sort: 'title',
    limit: 50,
    depth: 2,
    revalidate: REVALIDATE.categories,
    tags: ['categories', `category-${parentSlug}`],
  })

  return result.docs
}

export async function getCategoryBreadcrumbs(category) {
  const breadcrumbs = []
  let current = category

  while (current) {
    breadcrumbs.unshift({
      title: current.title,
      slug: current.slug,
      path: current.slug,
    })

    if (current.parent && typeof current.parent !== 'string') {
      current = current.parent
    } else if (typeof current.parent === 'string') {
      current = await getCategoryBySlug(current.parent)
    } else {
      break
    }
  }

  let pathAccumulator = ''
  return breadcrumbs.map((crumb) => {
    pathAccumulator = pathAccumulator ? `${pathAccumulator}/${crumb.slug}` : crumb.slug
    return { ...crumb, path: pathAccumulator }
  })
}

export async function getAllCategorySlugs() {
  const result = await payloadQuery('categories', {
    limit: 1000,
    depth: 2,
    revalidate: REVALIDATE.categories,
  })

  return result.docs.map((cat) => ({
    slug: cat.slug,
    parentSlug: cat.parent && typeof cat.parent !== 'string' ? cat.parent.slug : undefined,
  }))
}

export function buildCategoryPath(category) {
  if (category.parent && typeof category.parent !== 'string') {
    return `/proizvodi/${category.parent.slug}/${category.slug}`
  }

  return `/proizvodi/${category.slug}`
}
