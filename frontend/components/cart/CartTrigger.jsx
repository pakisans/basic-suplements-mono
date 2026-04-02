'use client';

import { useCart } from './CartProvider';

export function CartTrigger({ mobile = false }) {
  const { itemCount, isHydrated, openCart } = useCart();
  const count = isHydrated ? itemCount : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className={
        mobile
          ? 'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[11px] font-medium tracking-[0.22em] text-white uppercase transition-colors hover:border-white/30 hover:bg-white/[0.06]'
          : 'ml-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-[11px] font-medium tracking-[0.22em] text-white uppercase transition-colors hover:border-white/30 hover:bg-white hover:text-black'
      }
      aria-label={`Otvori korpu${count ? `, ${count} artikala` : ''}`}
    >
      <span>Korpa</span>
      <span
        className={
          mobile
            ? 'inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-black'
            : 'inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-black'
        }
      >
        {count}
      </span>
    </button>
  );
}
