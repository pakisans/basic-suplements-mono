'use client';

import { useEffect, useEffectEvent } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { CartLineItem } from './CartLineItem';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES, CURRENCY } from '@/constants';
import { formatCartPrice } from '@/lib/cart/product';

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem } =
    useCart();

  const handleKeyDown = useEffectEvent((event) => {
    if (event.key === 'Escape') closeCart();
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/82 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-hidden border-l border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_34%),linear-gradient(180deg,#070707_0%,#020202_52%,#000000_100%)] shadow-[0_40px_120px_-50px_rgba(0,0,0,1)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isOpen
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-x-[108%] scale-[0.985] opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Brza korpa"
      >
        <div
          className={`h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          className={`pointer-events-none absolute inset-x-6 top-24 h-40 rounded-full bg-white/[0.025] blur-3xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        />

        <div
          className={`relative flex items-center justify-between border-b border-white/6 px-5 py-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-7 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div>
            <div className="text-[10px] font-medium tracking-[0.28em] text-zinc-500 uppercase">
              Brza korpa
            </div>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Tvoji odabrani komadi
              {items.length > 0 && (
                <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full border border-white/10 bg-zinc-100 px-2 py-1 text-[10px] font-bold text-black">
                  {items.reduce((n, i) => n + i.quantity, 0)}
                </span>
              )}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Pregled artikala pre nego što nastaviš na naplatu.
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-zinc-500 transition-colors hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
            aria-label="Zatvori"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 6 18 18" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          className={`relative flex-1 overflow-y-auto px-5 py-5 transition-all delay-75 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-7 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {items.length > 0 ? (
            <div className="space-y-3 lg:space-y-4">
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
                <Button
                  href={ROUTES.products}
                  variant="outline"
                  onClick={closeCart}
                >
                  Pogledaj proizvode
                </Button>
              }
            />
          )}
        </div>

        {items.length > 0 && (
          <div
            className={`relative border-t border-white/6 bg-black/50 px-5 py-5 backdrop-blur-xl transition-all delay-100 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 sm:py-6 lg:px-7 ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <div className="rounded-[28px] border border-white/8 bg-zinc-950/90 p-4 lg:p-5 shadow-[0_20px_60px_-35px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.26em] text-zinc-500 uppercase">
                  Subtotal
                </span>
                <span className="text-xl font-semibold text-white">
                  {formatCartPrice(subtotal)} {CURRENCY.symbol}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Dostava i eventualni popusti se obračunavaju na sledećem koraku.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <Button
                href={ROUTES.cart}
                variant="outline"
                fullWidth
                onClick={closeCart}
                className="rounded-full px-4 py-2.5 text-[10px] tracking-[0.18em] sm:py-4 sm:text-[11px] sm:tracking-[0.24em]"
              >
                Pregledaj korpu
              </Button>
              <Link
                href={ROUTES.products}
                onClick={closeCart}
                className="block text-center text-[10px] font-medium tracking-[0.26em] text-zinc-500 uppercase transition-colors hover:text-white"
              >
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
