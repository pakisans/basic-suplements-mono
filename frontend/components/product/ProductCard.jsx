'use client'

import { useRouter } from 'next/navigation'
import { buildProductPath } from '@/services/products'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { ProductBadges } from '@/components/ui/Badge'
import { ProductPrice } from './ProductPrice'
import { QuickAddButton } from './QuickAddButton'
import { useCatalogMode } from '@/components/catalog/CatalogModeProvider'

function categoryLabel(product) {
  const first = Array.isArray(product.categories) ? product.categories[0] : null
  return first && typeof first === 'object' ? first.title : null
}

export function ProductCard({ product, className = '', priority = false }) {
  const router = useRouter()
  const { isCatalogOnly } = useCatalogMode()
  const href = buildProductPath(product)
  const primaryImage = product.gallery?.[0]?.image
  const eyebrow = categoryLabel(product)

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
      className={`group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 ${className}`}
      role="link"
      tabIndex={0}
      aria-label={product.title}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
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
              Basic Supplements
            </span>
          </div>
        )}

        {product.badges?.length > 0 && (
          <div className="pointer-events-none absolute left-3 top-3 z-20">
            <ProductBadges badges={product.badges} />
          </div>
        )}

        {!isCatalogOnly && <QuickAddButton product={product} />}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        {eyebrow && (
          <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
            {eyebrow}
          </p>
        )}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-zinc-300">
          {product.title}
        </h3>
        {!isCatalogOnly && (
          <div className="mt-auto pt-3">
            <ProductPrice
              price={product.price}
              salePrice={product.salePrice}
              saleStartDate={product.saleStartDate}
              saleEndDate={product.saleEndDate}
            />
          </div>
        )}
      </div>
    </article>
  )
}
