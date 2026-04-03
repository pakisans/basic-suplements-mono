'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { CartLineItem } from './CartLineItem';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES, CURRENCY } from '@/constants';
import { formatCartPrice } from '@/lib/cart/product';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, isHydrated } = useCart();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-900 pb-8">
        <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Korpa
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Pregled porudžbine
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Proveri artikle, prilagodi količine i nastavi dalje kada budeš
          spreman.
        </p>
      </div>

      {!isHydrated ? (
        <div className="py-12 text-sm text-zinc-500">Učitavanje korpe...</div>
      ) : items.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Korpa je prazna"
            description="Još nema dodatih artikala. Kreni iz kataloga i sastavi svoju kombinaciju."
            action={
              <Button href={ROUTES.products} variant="outline">
                Idi na proizvode
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {items.map((item) => (
              <CartLineItem
                key={item.key}
                item={item}
                onDecrease={() => updateQuantity(item.key, item.quantity - 1)}
                onIncrease={() => updateQuantity(item.key, item.quantity + 1)}
                onRemove={() => removeItem(item.key)}
              />
            ))}
          </div>

          <div className="h-fit border border-zinc-800 bg-zinc-950 p-6">
            <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Sažetak
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-xl font-semibold text-white">
                {formatCartPrice(subtotal)} {CURRENCY.symbol}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Troškovi dostave i završni koraci naplate se dodaju u narednoj
              fazi checkout toka.
            </p>
            <div className="mt-6 space-y-3">
              <Button
                href={ROUTES.checkout}
                fullWidth
                className="px-4 py-2.5 text-[10px] tracking-[0.18em] sm:py-3 sm:text-xs sm:tracking-widest"
              >
                Nastavi na plaćanje
              </Button>
              <Button
                href={ROUTES.products}
                variant="outline"
                fullWidth
                className="px-4 py-2.5 text-[10px] tracking-[0.18em] sm:py-3 sm:text-xs sm:tracking-widest"
              >
                Dodaj još proizvoda
              </Button>
              <Link
                href={ROUTES.home}
                className="block text-center text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
              >
                Nazad na početnu
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
