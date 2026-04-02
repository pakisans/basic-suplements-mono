import Link from 'next/link'
import { buildProductPath } from '@/services/products'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { ProductBadges } from '@/components/ui/Badge'
import { ProductPrice } from './ProductPrice'
import { QuickAddButton } from './QuickAddButton'

export function ProductCard({ product, className = '', priority = false }) {
  const href = buildProductPath(product)
  const primaryImage = product.gallery?.[0]?.image

  return (
    <article className={`group relative ${className}`}>
      {/* Full-card link — pokriva celu karticu, z-0 ispod svega */}
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-label={product.title}
      />

      {/* Image area */}
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-zinc-900">
        {/* Sekundarni overlay unutar slike (tabIndex={-1} da nema duplog taba) */}
        <Link
          href={href}
          className="absolute inset-0 z-0"
          tabIndex={-1}
          aria-hidden="true"
        />

        {primaryImage ? (
          <PayloadImage
            media={primaryImage}
            fill
            priority={priority}
            className="relative z-0 object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium tracking-widest text-zinc-700 uppercase">
              Slika
            </span>
          </div>
        )}

        {product.badges?.length > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <ProductBadges badges={product.badges} />
          </div>
        )}

        {/* Quick add — z-10/z-20 interno, iznad link overlay-a */}
        <QuickAddButton product={product} />
      </div>

      {/* Info — pointer-events-none da klikovi padaju kroz na full-card link */}
      <div className="pointer-events-none space-y-1.5">
        <h3 className="line-clamp-2 text-sm font-medium text-white transition-opacity group-hover:opacity-60">
          {product.title}
        </h3>
        <ProductPrice
          price={product.price}
          salePrice={product.salePrice}
          saleStartDate={product.saleStartDate}
          saleEndDate={product.saleEndDate}
        />
      </div>
    </article>
  )
}
