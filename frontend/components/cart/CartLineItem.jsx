'use client';

import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { CartQuantityControl } from './CartQuantityControl';
import { formatCartPrice } from '@/lib/cart/product';
import { CURRENCY } from '@/constants';

export function CartLineItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  compact = false,
}) {
  return (
    <div className="group rounded-[28px] border border-white/6 bg-gradient-to-br from-black via-zinc-950 to-black p-3 shadow-[0_20px_60px_-32px_rgba(0,0,0,0.9)] transition-colors hover:border-white/10">
      <Link
        href={item.productPath}
        className="relative block h-32 w-28 shrink-0 overflow-hidden rounded-[22px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%),linear-gradient(180deg,#111111_0%,#060606_100%)] transition-transform duration-500 group-hover:scale-[1.02] sm:h-36 sm:w-32"
      >
        {item.image ? (
          <>
            <div className="absolute inset-[6px] rounded-[18px] bg-black/50" />
            <PayloadImage
              media={item.image}
              fill
              className="object-contain object-center p-2 transition-transform duration-700 group-hover:scale-105"
              sizes="128px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/[0.03]" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-[10px] font-medium tracking-[0.24em] text-zinc-500 uppercase">
            Basic
          </div>
        )}
      </Link>

      <div className="mt-3 min-w-0 sm:mt-0 sm:flex sm:min-h-[144px] sm:flex-1 sm:flex-col sm:justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={item.productPath}
              className="line-clamp-2 text-sm font-semibold tracking-[0.01em] text-white transition-opacity hover:opacity-75 sm:text-[15px]"
            >
              {item.title}
            </Link>
            {item.selectedOptions.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-300">
                {item.selectedOptions.map((option) => (
                  <li
                    key={`${item.key}-${option.id}`}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1"
                  >
                    <span className="text-zinc-500">{option.typeLabel}</span>{' '}
                    <span className="text-zinc-100">{option.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-white/8 px-3 text-[10px] font-medium tracking-[0.22em] text-zinc-400 uppercase transition-colors hover:border-white/12 hover:bg-white/[0.03] hover:text-white"
          >
            Ukloni
          </button>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/6 pt-4">
          <CartQuantityControl
            quantity={item.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            compact={compact}
          />

          <div className="text-right">
            <div className="text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase">
              Ukupno
            </div>
            <div className="mt-1 text-base font-semibold text-white">
              {formatCartPrice(item.unitPrice * item.quantity)}{' '}
              {CURRENCY.symbol}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {formatCartPrice(item.unitPrice)} {CURRENCY.symbol} / kom
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
