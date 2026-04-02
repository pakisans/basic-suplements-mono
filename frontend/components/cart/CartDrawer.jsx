'use client'

import { useEffect, useEffectEvent } from 'react'
import Link from 'next/link'
import { useCart } from './CartProvider'
import { CartLineItem } from './CartLineItem'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ROUTES, CURRENCY } from '@/constants'
import { formatCartPrice } from '@/lib/cart/product'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart()

  const handleKeyDown = useEffectEvent((event) => {
    if (event.key === 'Escape') closeCart()
  })

  useEffect(() => {
    if (!isOpen) return undefined

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-zinc-950 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Brza korpa"
      >
        {/* Top border accent */}
        <div className={`h-px w-full bg-gradient-to-r from-transparent via-zinc-600 to-transparent transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-4">
          <div>
            <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Brza korpa
            </div>
            <h2 className="mt-0.5 text-base font-semibold text-white">
              Tvoji artikli
              {items.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center bg-white text-[10px] font-bold text-black">
                  {items.reduce((n, i) => n + i.quantity, 0)}
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-9 w-9 items-center justify-center border border-zinc-800 text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white"
            aria-label="Zatvori"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6 18 18" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <CartLineItem
                  key={item.key}
                  item={item}
                  compact
                  onDecrease={() => updateQuantity(item.key, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item.key, item.quantity + 1)}
                  onRemove={() => removeItem(item.key)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Korpa je prazna"
              description="Dodaj proizvod iz kataloga i ovde ćeš odmah videti pregled izabranih artikala."
              action={
                <Button href={ROUTES.products} variant="outline" onClick={closeCart}>
                  Pogledaj proizvode
                </Button>
              }
            />
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-900 px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Subtotal
              </span>
              <span className="text-lg font-semibold text-white">
                {formatCartPrice(subtotal)} {CURRENCY.symbol}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-600">Dostava se obračunava pri naplati</p>

            <div className="mt-4 space-y-3">
              <Button href={ROUTES.checkout} fullWidth onClick={closeCart}>
                Nastavi na plaćanje
              </Button>
              <Button href={ROUTES.cart} variant="outline" fullWidth onClick={closeCart}>
                Pregledaj korpu
              </Button>
              <Link
                href={ROUTES.products}
                onClick={closeCart}
                className="block text-center text-xs font-medium tracking-widest text-zinc-600 uppercase transition-colors hover:text-white"
              >
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
