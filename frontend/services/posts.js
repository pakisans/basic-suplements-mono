import { payloadQuery, payloadFindBySlug } from '@/lib/payload/client'
import { DEFAULT_PAGE_SIZE, REVALIDATE } from '@/constants'

export async function getPosts(options = {}) {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, categorySlug, sort = '-publishedAt' } = options
  const where = {
    _status: { equals: 'published' },
  }

  if (categorySlug) {
    where['categories.slug'] = { equals: categorySlug }
  }

  return payloadQuery('posts', {
    where,
    sort,
    limit,
    page,
    depth: 2,
    revalidate: REVALIDATE.posts,
    tags: ['posts'],
  })
}

export async function getPostBySlug(slug) {
  return payloadFindBySlug('posts', slug, {
    depth: 3,
    revalidate: REVALIDATE.posts,
    tags: ['posts', `post-${slug}`],
    where: { _status: { equals: 'published' } },
  })
}

export async function getPostCategories() {
  const result = await payloadQuery('post-categories', {
    sort: 'title',
    limit: 100,
    depth: 1,
    revalidate: REVALIDATE.categories,
    tags: ['post-categories'],
  })

  return result.docs
}

export async function getPostCategoryBySlug(slug) {
  return payloadFindBySlug('post-categories', slug, {
    depth: 2,
    revalidate: REVALIDATE.categories,
    tags: ['post-categories', `post-category-${slug}`],
  })
}

export async function getRelatedPosts(postId, limit = 3) {
  const result = await payloadQuery('posts', {
    where: {
      _status: { equals: 'published' },
      id: { not_equals: postId },
    },
    sort: '-publishedAt',
    limit,
    depth: 2,
    revalidate: REVALIDATE.posts,
    tags: ['posts'],
  })

  return result.docs
}

export async function getAllPostSlugs() {
  const result = await payloadQuery('posts', {
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    revalidate: REVALIDATE.posts,
  })

  return result.docs.map((p) => ({ slug: p.slug }))
}
