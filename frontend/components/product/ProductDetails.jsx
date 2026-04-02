'use client'

import { useState } from 'react'
import { ProductBadges } from '@/components/ui/Badge'
import { RichText } from '@/components/ui/RichText'

export function ProductDetails({ product }) {
  const [expanded, setExpanded] = useState(false)

  const brand =
    product.brand && typeof product.brand !== 'string' ? product.brand : null

  return (
    <div className="space-y-5">
      {brand && (
        <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Brend: <span className="text-zinc-300">{brand.title}</span>
        </div>
      )}

      {product.badges?.length > 0 && <ProductBadges badges={product.badges} />}

      {product.description && (
        <div className="space-y-2">
          <div
            className={[
              'prose max-w-none overflow-hidden transition-all duration-300',
              expanded ? '' : 'max-h-32',
            ].join(' ')}
          >
            <RichText content={product.description} />
          </div>

          {!expanded && (
            <div className="-mt-8 h-8 bg-gradient-to-t from-black to-transparent" />
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
          >
            {expanded ? 'Prikaži manje ↑' : 'Prikaži više ↓'}
          </button>
        </div>
      )}

      {product.highlights?.length > 0 && (
        <ul className="space-y-2 text-sm text-zinc-300">
          {product.highlights.map((item, index) => (
            <li key={item.id ?? index} className="flex items-center gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
