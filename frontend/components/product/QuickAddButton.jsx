'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import {
  createCartItem,
  getProductOptionGroups,
  getSelectedVariant,
  isOptionAvailableForSelection,
  productHasVariants,
} from '@/lib/cart/product'

export function QuickAddButton({ product }) {
  const { addItem } = useCart()
  const hasVariants = productHasVariants(product)
  const optionGroups = getProductOptionGroups(product)

  const [isOpen, setIsOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() =>
    optionGroups
      .filter((g) => g.options.length === 1)
      .map((g) => g.options[0].id),
  )

  const selectedVariant = getSelectedVariant(product, selectedIds)
  const allGroupsSelected = optionGroups.every((group) =>
    selectedIds.some((id) =>
      group.options.some((o) => String(o.id) === String(id)),
    ),
  )
  const canAdd =
    !hasVariants || (allGroupsSelected && Boolean(selectedVariant))

  const hasStock = selectedVariant
    ? (selectedVariant.inventory ?? null) === null || selectedVariant.inventory > 0
    : true

  function handleTrigger(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!hasStock) return

    if (!hasVariants) {
      addItem(createCartItem(product, null, 1), { openCart: true })
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
      return
    }
    setIsOpen(true)
  }

  function handleClose(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
  }

  function handleOptionSelect(e, group, optionId) {
    e.preventDefault()
    e.stopPropagation()
    setSelectedIds((prev) => {
      const without = prev.filter(
        (id) => !group.options.some((o) => String(o.id) === String(id)),
      )
      return [...without, optionId]
    })
  }

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!canAdd || !hasStock) return
    addItem(createCartItem(product, selectedVariant, 1), { openCart: true })
    setIsOpen(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      {/* Hover trigger — slides up from bottom of image */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 transition-transform duration-300 ${
          isOpen || added
            ? 'translate-y-0'
            : 'translate-y-full group-hover:translate-y-0'
        }`}
      >
        <button
          type="button"
          onClick={handleTrigger}
          disabled={!hasStock}
          className={`flex h-11 w-full items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase backdrop-blur-sm transition-colors ${
            hasStock
              ? 'bg-white/95 text-black hover:bg-white'
              : 'bg-zinc-900/90 text-zinc-500'
          }`}
        >
          {added ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
              </svg>
              Dodato
            </>
          ) : !hasStock ? (
            'Nema na stanju'
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              {hasVariants ? 'Izaberi opciju' : 'Brzo dodaj'}
            </>
          )}
        </button>
      </div>

      {/* Variant picker — overlays the image */}
      {isOpen && (
        <div
          className="absolute inset-0 z-20 flex flex-col bg-zinc-950/98 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
                Brza korpa
              </p>
              <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-white">
                {product.title}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="ml-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center text-zinc-500 transition-colors hover:text-white"
              aria-label="Zatvori"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M6 6 18 18M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {optionGroups.map((group) => {
              const isGroupSelected = selectedIds.some((id) =>
                group.options.some((o) => String(o.id) === String(id)),
              )
              return (
                <div key={group.id}>
                  <p
                    className={`mb-2 text-[10px] font-medium tracking-widest uppercase ${
                      isGroupSelected ? 'text-zinc-500' : 'text-amber-400'
                    }`}
                  >
                    {isGroupSelected ? group.label : `Izaberite ${group.label}`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.options.map((option) => {
                      const selected = selectedIds.some(
                        (id) => String(id) === String(option.id),
                      )
                      const available = isOptionAvailableForSelection(
                        product,
                        group.id,
                        option.id,
                        selectedIds,
                      )
                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={!available}
                          onClick={(e) => handleOptionSelect(e, group, option.id)}
                          className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                            selected
                              ? 'border-white bg-white text-black'
                              : available
                                ? 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                                : 'border-zinc-900 text-zinc-700 line-through'
                          }`}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            disabled={!canAdd || !hasStock}
            onClick={handleAdd}
            className="mt-3 h-10 w-full bg-white text-xs font-medium tracking-widest text-black uppercase transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!hasStock
              ? 'Trenutno nema zaliha'
              : !canAdd
                ? 'Izaberi sve opcije'
                : 'Dodaj u korpu'}
          </button>
        </div>
      )}
    </>
  )
}
