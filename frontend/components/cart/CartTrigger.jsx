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
          ? 'inline-flex items-center gap-2 border border-zinc-800 px-3 py-2 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:border-white'
          : 'ml-2 inline-flex items-center gap-2 border border-white px-4 py-2 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black'
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
