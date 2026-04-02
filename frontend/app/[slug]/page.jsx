import React from 'react'
import { notFound } from 'next/navigation'
import { getPageBySlug, getAllPageSlugs } from '@/services/pages'
import { Hero } from '@/components/layout/Hero'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateStaticParams() {
  return getAllPageSlugs()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) return {}

  return buildMetadata({
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
    image: page.meta?.image ?? undefined,
    canonical: `/${slug}`,
  })
}

export default async function CmsPage({ params }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) notFound()

  return (
    <>
      <Hero hero={page.hero} />
      {page.layout && <BlockRenderer blocks={page.layout} />}
    </>
  )
}
