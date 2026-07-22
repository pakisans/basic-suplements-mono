'use client'

import { useRef } from 'react'
import { FeaturedProductCard } from './FeaturedProductCard'

/**
 * Horizontal, drag-to-scroll product carousel. On hover, the other cards dim so
 * the hovered card stands out, and it lifts slightly.
 */
export function ProductCarousel({ products, featuredIndex = -1 }) {
  const trackRef = useRef(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false })

  function onPointerDown(e) {
    const el = trackRef.current
    if (!el) return
    drag.current = { down: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false }
    el.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e) {
    const el = trackRef.current
    if (!el || !drag.current.down) return
    const dx = e.pageX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.scrollLeft - dx
  }

  function endDrag() {
    drag.current.down = false
  }

  // Swallow the click that ends a drag so cards don't navigate mid-swipe.
  function onClickCapture(e) {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      className="group/track flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 select-none active:cursor-grabbing sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {products.map((product, index) => (
        <div
          key={product.id ?? index}
          className="w-[80%] shrink-0 snap-start transition-all duration-300 ease-out group-hover/track:opacity-40 hover:z-10 hover:-translate-y-1 hover:!opacity-100 sm:w-[46%] lg:w-[24%]"
        >
          <FeaturedProductCard
            product={product}
            featured={index === featuredIndex}
            priority={index < 2}
          />
        </div>
      ))}
    </div>
  )
}
