import { payloadQuery, payloadFindBySlug } from '@/lib/payload/client';
import { DEFAULT_PAGE_SIZE, REVALIDATE } from '@/constants';

function buildProductWhere(filters = {}) {
  const where = {
    _status: { equals: 'published' },
    visibility: { not_equals: 'hidden' },
  };

  if (filters.categories?.length) {
    where['categories.slug'] = { in: filters.categories };
  }

  if (filters.brands?.length) {
    where['brand.slug'] = { in: filters.brands };
  }

  if (filters.tags?.length) {
    where['tags.slug'] = { in: filters.tags };
  }

  if (filters.minPrice !== undefined) {
    where.price = { greater_than: filters.minPrice - 1 };
  }

  if (filters.maxPrice !== undefined) {
    where.price = { ...(where.price ?? {}), less_than: filters.maxPrice + 1 };
  }

  if (filters.search) {
    where.title = { like: filters.search };
  }

  return where;
}

export async function getProducts(filters = {}, pagination = {}) {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    sort = '-createdAt',
  } = pagination;

  return payloadQuery('products', {
    where: buildProductWhere(filters),
    sort,
    limit,
    page,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: ['products'],
  });
}

export async function getProductBySlug(slug) {
  const product = await payloadFindBySlug('products', slug, {
    depth: 3,
    revalidate: REVALIDATE.products,
    tags: [`product-${slug}`, 'products'],
    where: { _status: { equals: 'published' } },
  });

  if (!product) return null;

  const variantsResult = await payloadQuery('variants', {
    where: { product: { equals: product.id } },
    limit: 200,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: [`product-${slug}`, 'products'],
  });

  return {
    ...product,
    variants: variantsResult.docs,
  };
}

export async function getProductsByCategory(
  categorySlug,
  pagination = {},
  sort = '-createdAt',
) {
  const { page = 1, limit = DEFAULT_PAGE_SIZE } = pagination;

  return payloadQuery('products', {
    where: {
      _status: { equals: 'published' },
      visibility: { not_equals: 'hidden' },
      'categories.slug': { equals: categorySlug },
    },
    sort,
    limit,
    page,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: ['products', `category-${categorySlug}`],
  });
}

export async function getFeaturedProducts(limit = 8) {
  const result = await payloadQuery('products', {
    where: {
      _status: { equals: 'published' },
      visibility: { not_equals: 'hidden' },
      // badges: { in: ['featured'] },
    },
    limit,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: ['products'],
  });

  return result.docs;
}

export async function getNewProducts(limit = 8) {
  const result = await payloadQuery('products', {
    where: {
      _status: { equals: 'published' },
      visibility: { not_equals: 'hidden' },
    },
    sort: '-createdAt',
    limit,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: ['products'],
  });

  return result.docs;
}

export async function getRelatedProducts(productId, categoryIds, limit = 4) {
  if (!categoryIds.length) return [];

  const result = await payloadQuery('products', {
    where: {
      _status: { equals: 'published' },
      visibility: { not_equals: 'hidden' },
      id: { not_equals: productId },
      categories: { in: categoryIds },
    },
    limit,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: ['products'],
  });

  return result.docs;
}

export async function getSaleProducts(limit = 12) {
  const result = await payloadQuery('products', {
    where: {
      _status: { equals: 'published' },
      visibility: { not_equals: 'hidden' },
      salePrice: { exists: true },
    },
    limit,
    depth: 2,
    revalidate: REVALIDATE.products,
    tags: ['products'],
  });

  return result.docs;
}

export function buildProductPath(product) {
  return `/proizvodi/${product.slug}`;
}

export async function getAllProductSlugs() {
  const result = await payloadQuery('products', {
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    revalidate: REVALIDATE.products,
  });

  return result.docs.map((p) => ({ slug: p.slug }));
}
