import React from 'react'
import { getProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CategoryCard } from '@/components/category/CategoryCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { ProductSort } from '@/components/product/ProductSort'
import { buildMetadata } from '@/lib/seo/metadata'
import { DEFAULT_PAGE_SIZE } from '@/constants'

export const metadata = buildMetadata({
  title: 'Svi proizvodi',
  description: 'Pregledajte kompletnu ponudu proizvoda.',
  canonical: '/proizvodi',
})

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams
  const page = parseInt(sp.stranica ?? '1')
  const sort = sp.sortiranje ?? '-createdAt'

  const [productsData, categories] = await Promise.all([
    getProducts({}, { page, limit: DEFAULT_PAGE_SIZE, sort }),
    getCategories({ parentOnly: true, limit: 8 }),
  ])

  return (
    <>
      <div className="border-b border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Svi proizvodi' }]} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Svi proizvodi</h1>
          <p className="mt-2 text-sm text-zinc-500">{productsData.totalDocs} proizvoda</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-5 text-xs font-medium tracking-widest text-zinc-500 uppercase">Kategorije</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-zinc-600">
            {Math.min((page - 1) * DEFAULT_PAGE_SIZE + 1, productsData.totalDocs)}–
            {Math.min(page * DEFAULT_PAGE_SIZE, productsData.totalDocs)} od {productsData.totalDocs}
          </p>
          <ProductSort />
        </div>

        <ProductGrid products={productsData.docs} columns={4} />

        <Pagination
          currentPage={productsData.page}
          totalPages={productsData.totalPages}
          className="mt-12"
        />
      </div>
    </>
  )
}
