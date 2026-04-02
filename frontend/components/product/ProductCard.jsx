'use client'

import { useRouter } from 'next/navigation'
import { buildProductPath } from '@/services/products'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { ProductBadges } from '@/components/ui/Badge'
import { ProductPrice } from './ProductPrice'
import { QuickAddButton } from './QuickAddButton'

export function ProductCard({ product, className = '', priority = false }) {
  const router = useRouter()
  const href = buildProductPath(product)
  const primaryImage = product.gallery?.[0]?.image

  function shouldIgnoreCardNavigation(target) {
    return target instanceof Element && Boolean(target.closest('[data-no-card-nav="true"]'))
  }

  function handleCardClick(event) {
    if (event.defaultPrevented || shouldIgnoreCardNavigation(event.target)) return
    router.push(href)
  }

  function handleCardKeyDown(event) {
    if (event.defaultPrevented || shouldIgnoreCardNavigation(event.target)) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      router.push(href)
    }
  }

  return (
    <article
      className={`group relative isolate cursor-pointer ${className}`}
      role="link"
      tabIndex={0}
      aria-label={product.title}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative z-0 mb-4 aspect-[4/5] overflow-hidden bg-zinc-900">
        {primaryImage ? (
          <PayloadImage
            media={primaryImage}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
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
          <div className="absolute left-3 top-3 z-20 pointer-events-none">
            <ProductBadges badges={product.badges} />
          </div>
        )}

        <QuickAddButton product={product} />
      </div>

      <div className="relative z-0 space-y-1.5">
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
