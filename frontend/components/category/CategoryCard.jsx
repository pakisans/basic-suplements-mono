import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { buildCategoryPath } from '@/services/categories';

export function CategoryCard({ category, className = '' }) {
  return (
    <Link
      href={buildCategoryPath(category)}
      className={`group relative block overflow-hidden bg-zinc-900 transition-opacity hover:opacity-80 ${className}`}
    >
      <div className="relative aspect-[4/3]">
        {category.image ? (
          <PayloadImage
            media={category.image}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white">{category.title}</h3>
          {category.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
