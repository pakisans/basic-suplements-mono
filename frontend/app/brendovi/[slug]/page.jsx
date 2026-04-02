import React from 'react'
import { notFound } from 'next/navigation'
import { getBrandBySlug } from '@/services/brands'
import { getProducts } from '@/services/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { buildMetadata } from '@/lib/seo/metadata'
import { DEFAULT_PAGE_SIZE } from '@/constants'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const brand = await getBrandBySlug(slug)

  if (!brand) return {}

  return buildMetadata({
    title: brand.title,
    description: brand.description ?? undefined,
    image: brand.logo ?? undefined,
    canonical: `/brendovi/${slug}`,
  })
}

export default async function BrandPage({ params, searchParams }) {
  const { slug } = await params
  const sp = await searchParams
  const page = parseInt(sp.stranica ?? '1')

  const [brand, productsData] = await Promise.all([
    getBrandBySlug(slug),
    getProducts({ brands: [slug] }, { page, limit: DEFAULT_PAGE_SIZE }),
  ])

  if (!brand) notFound()

  const logo = brand.logo

  return (
    <>
      <div className="border-b border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: brand.title }]} />
          <div className="mt-5 flex items-center gap-6">
            {logo && (
              <div className="relative h-16 w-16 overflow-hidden border border-zinc-800 bg-zinc-900 p-2">
                <PayloadImage media={logo} fill className="object-contain" sizes="64px" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{brand.title}</h1>
              {brand.description && (
                <p className="mt-1 max-w-xl text-zinc-500">{brand.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductGrid
          products={productsData.docs}
          columns={4}
          emptyTitle="Nema proizvoda ovog brenda"
        />
      </div>

      {brand.layout && brand.layout.length > 0 && (
        <BlockRenderer blocks={brand.layout} />
      )}
    </>
  )
}
