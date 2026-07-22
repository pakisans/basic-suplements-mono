import React from 'react'
import { getHomePage } from '@/services/pages'
import { getFeaturedProducts, getNewProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { getHomeHero } from '@/services/globals'
import { Hero } from '@/components/layout/Hero'
import { SplitHero } from '@/components/homepage/SplitHero'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { buildMetadata } from '@/lib/seo/metadata'
import { SITE_NAME, SITE_DESCRIPTION } from '@/constants'

export const metadata = buildMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  canonical: '/',
})

export default async function HomePage() {
  const [page, homeHero, featuredProducts, newProducts, categories] =
    await Promise.all([
      getHomePage(),
      getHomeHero(),
      getFeaturedProducts(4),
      getNewProducts(8),
      getCategories({ parentOnly: true, limit: 6 }),
    ])

  const heroSections = homeHero?.sections ?? []
  const hasPageHero = page?.hero && page.hero.type !== 'none'
  const hasBlocks = page?.layout && page.layout.length > 0

  return (
    <>
      {heroSections.length > 0 && <BlockRenderer blocks={heroSections} />}

      {hasPageHero && <Hero hero={page.hero} />}

      {hasBlocks ? (
        <BlockRenderer blocks={page.layout} />
      ) : (
        !hasPageHero && heroSections.length === 0 && <SplitHero categories={categories} />
      )}

      {!hasBlocks && (
        <>
          {featuredProducts.length > 0 && (
            <Section>
              <SectionHeading
                title="Featured products"
                subtitle="Handpicked for you"
              />
              <ProductGrid products={featuredProducts} columns={4} />
              <div className="mt-12 text-center">
                <Button href="/products" variant="outline">
                  Shop all
                </Button>
              </div>
            </Section>
          )}

          {newProducts.length > 0 && (
            <Section className="border-t border-zinc-900">
              <SectionHeading title="New arrivals" />
              <ProductGrid products={newProducts} columns={4} />
            </Section>
          )}
        </>
      )}
    </>
  )
}
