import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts, getPostCategoryBySlug, getPostCategories } from '@/services/posts'
import { PostGrid } from '@/components/blog/PostGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/Badge'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = await getPostCategoryBySlug(slug)

  if (!category) return {}

  return buildMetadata({
    title: `Blog — ${category.title}`,
    description: category.description ?? undefined,
    image: category.image ?? undefined,
    canonical: `/blog/kategorija/${slug}`,
  })
}

export default async function BlogCategoryPage({ params, searchParams }) {
  const { slug } = await params
  const sp = await searchParams
  const page = parseInt(sp.stranica ?? '1')

  const [category, postsData, allCategories] = await Promise.all([
    getPostCategoryBySlug(slug),
    getPosts({ page, limit: 9, categorySlug: slug }),
    getPostCategories(),
  ])

  if (!category) notFound()

  return (
    <>
      <div className="border-b border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: category.title },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">{category.title}</h1>
          {category.description && (
            <p className="mt-2 text-zinc-500">{category.description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {allCategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link href="/blog">
              <Badge variant="default">Sve</Badge>
            </Link>
            {allCategories.map((cat) => (
              <Link key={cat.id} href={`/blog/kategorija/${cat.slug}`}>
                <Badge variant={cat.slug === slug ? 'featured' : 'info'}>{cat.title}</Badge>
              </Link>
            ))}
          </div>
        )}

        <PostGrid posts={postsData.docs} columns={3} />

        <Pagination
          currentPage={postsData.page}
          totalPages={postsData.totalPages}
          className="mt-12"
        />
      </div>
    </>
  )
}
