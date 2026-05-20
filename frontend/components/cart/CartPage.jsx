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
          Cart
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Order review
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Review your items, adjust quantities, and continue when you are ready.
        </p>
      </div>

      {!isHydrated ? (
        <div className="py-12 text-sm text-zinc-500">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Your cart is empty"
            description="No items added yet. Start from the catalog and build your selection."
            action={
              <Button href={ROUTES.products} variant="outline">
                Browse products
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
              Summary
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-xl font-semibold text-white">
                {formatCartPrice(subtotal)} {CURRENCY.symbol}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Shipping costs and final checkout details are added in the next step.
            </p>
            <div className="mt-6 space-y-3">
              <Button
                href={ROUTES.checkout}
                fullWidth
                className="px-4 py-2.5 text-[10px] tracking-[0.18em] sm:py-3 sm:text-xs sm:tracking-widest"
              >
                Proceed to checkout
              </Button>
              <Button
                href={ROUTES.products}
                variant="outline"
                fullWidth
                className="px-4 py-2.5 text-[10px] tracking-[0.18em] sm:py-3 sm:text-xs sm:tracking-widest"
              >
                Add more products
              </Button>
              <Link
                href={ROUTES.home}
                className="block text-center text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
