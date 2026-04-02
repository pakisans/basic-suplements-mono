import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/services/posts'
import { RichText } from '@/components/ui/RichText'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { PostGrid } from '@/components/blog/PostGrid'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { Section, SectionHeading } from '@/components/ui/Section'
import { buildMetadata } from '@/lib/seo/metadata'
import { Badge } from '@/components/ui/Badge'

export async function generateStaticParams() {
  return getAllPostSlugs()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  return buildMetadata({
    title: post.meta?.title ?? post.title,
    description: post.meta?.description ?? post.excerpt ?? undefined,
    image: post.meta?.image ?? post.featuredImage ?? undefined,
    canonical: `/blog/${slug}`,
  })
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post.id, 3)
  const categories = post.categories ?? []
  const featuredImage = post.featuredImage

  return (
    <>
      <div className="border-b border-zinc-900">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/blog/kategorija/${cat.slug}`}>
                  <Badge variant="info">{cat.title}</Badge>
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-600">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
            {post.readTime && (
              <>
                <span>·</span>
                <span>{post.readTime} min čitanja</span>
              </>
            )}
          </div>
        </div>
      </div>

      <article className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {featuredImage && (
          <div className="relative mb-10 aspect-video overflow-hidden">
            <PayloadImage
              media={featuredImage}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="mb-8 text-xl font-medium leading-relaxed text-zinc-300">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div className="prose max-w-none">
            <RichText content={post.content} />
          </div>
        )}

        {post.layout && post.layout.length > 0 && (
          <div className="mt-12">
            <BlockRenderer blocks={post.layout} />
          </div>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <Section className="border-t border-zinc-900">
          <SectionHeading title="Slični članci" />
          <PostGrid posts={relatedPosts} columns={3} />
        </Section>
      )}
    </>
  )
}
