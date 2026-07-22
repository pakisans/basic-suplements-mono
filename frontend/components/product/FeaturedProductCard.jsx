'use client'

import Link from 'next/link'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { buildProductPath } from '@/services/products'
import { useCatalogMode } from '@/components/catalog/CatalogModeProvider'
import { CURRENCY } from '@/constants'

const BADGE_LABELS = {
  new: 'New',
  sale: 'Sale',
  bestseller: 'Bestseller',
  featured: 'Featured',
  limited: 'Limited',
  preorder: 'Preorder',
}

function categoryLabel(product) {
  const first = Array.isArray(product.categories) ? product.categories[0] : null
  return first && typeof first === 'object' ? first.title : null
}

function topBadge(product) {
  const b = Array.isArray(product.badges) ? product.badges[0] : null
  return b ? (BADGE_LABELS[b] ?? b) : null
}

function fromPrice(product) {
  const value = product.salePrice ?? product.price
  if (value === undefined || value === null) return null
  return `${new Intl.NumberFormat('sr-RS').format(value)} ${CURRENCY.symbol}`
}

/**
 * Large, centered "featured" product card (curated home sections): badge,
 * category pill, name, product image, a Shop Now button, and a "from" price.
 */
export function FeaturedProductCard({ product, featured = false, priority = false }) {
  const { isCatalogOnly } = useCatalogMode()
  const href = buildProductPath(product)
  const image = product.gallery?.[0]?.image
  const category = categoryLabel(product)
  const badge = topBadge(product)
  const price = fromPrice(product)

  return (
    <div
      className={`group relative flex h-full flex-col items-center rounded-3xl border p-6 text-center transition-colors duration-300 md:p-7 ${
        featured
          ? 'border-white/15 bg-zinc-900'
          : 'border-white/[0.08] bg-zinc-950 hover:border-white/20'
      }`}
    >
      {badge && (
        <span className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur">
          {badge}
        </span>
      )}

      {category && (
        <span className="mb-5 rounded-full border border-white/15 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          {category}
        </span>
      )}

      <Link
        href={href}
        className="mb-6 block text-lg font-bold leading-tight tracking-tight text-white transition-opacity group-hover:opacity-80 md:text-xl"
      >
        {product.title}
      </Link>

      <Link
        href={href}
        aria-label={product.title}
        className="relative mb-7 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-300"
      >
        {image && (
          <PayloadImage
            media={image}
            fill
            priority={priority}
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />
        )}
      </Link>

      <div className="mt-auto flex flex-col items-center gap-4">
        <Link
          href={href}
          className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-[13px] font-semibold transition-colors ${
            featured
              ? 'bg-white text-black hover:bg-zinc-200'
              : 'border border-white/25 text-white hover:border-white hover:bg-white hover:text-black'
          }`}
        >
          Shop now <span aria-hidden="true">→</span>
        </Link>

        {!isCatalogOnly && price && (
          <p className="text-[13px] text-zinc-500">
            From <span className="font-semibold text-zinc-300">{price}</span>
          </p>
        )}
      </div>
    </div>
  )
}
