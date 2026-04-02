import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { Badge } from '@/components/ui/Badge';

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

export function PostCard({ post, className = '', priority = false }) {
  const href = `/blog/${post.slug}`;
  const image = post.featuredImage;
  const categories = post.categories ?? [];

  return (
    <article className={`group flex flex-col ${className}`}>
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative mb-4 aspect-video overflow-hidden bg-zinc-900">
          {image ? (
            <PayloadImage
              media={image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((cat) => (
              <Link key={cat.id} href={`/blog/kategorija/${cat.slug}`}>
                <Badge variant="info">{cat.title}</Badge>
              </Link>
            ))}
          </div>
        )}

        <Link href={href}>
          <h3 className="line-clamp-2 font-semibold text-white transition-opacity group-hover:opacity-60">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="line-clamp-3 text-sm text-zinc-500">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-zinc-400">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          )}
          {post.readTime && (
            <>
              <span>·</span>
              <span>{post.readTime} min čitanja</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
