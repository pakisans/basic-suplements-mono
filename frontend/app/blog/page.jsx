export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import { getPosts, getPostCategories } from '@/services/posts'
import { PostGrid } from '@/components/blog/PostGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/Badge'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata = buildMetadata({
  title: 'Blog',
  description: 'Najnoviji članci i vesti',
  canonical: '/blog',
})

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams
  const page = parseInt(sp.stranica ?? '1')

  const [postsData, categories] = await Promise.all([
    getPosts({ page, limit: 9 }),
    getPostCategories(),
  ])

  return (
    <>
      <div className="border-b border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog' }]} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Blog</h1>
          <p className="mt-2 text-zinc-500">Najnoviji članci i vesti</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link href="/blog">
              <Badge variant="default">Sve</Badge>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/blog/kategorija/${cat.slug}`}>
                <Badge variant="info">{cat.title}</Badge>
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
