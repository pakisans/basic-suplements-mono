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
    <div className="flex gap-4 border-b border-zinc-900 pb-4">
      <Link
        href={item.productPath}
        className="relative block h-24 w-20 shrink-0 overflow-hidden bg-zinc-900 transition-opacity hover:opacity-80"
      >
        {item.image ? (
          <PayloadImage
            media={item.image}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={item.productPath}
              className="text-sm font-semibold text-white transition-opacity hover:opacity-70"
            >
              {item.title}
            </Link>
            {item.selectedOptions.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-zinc-500">
                {item.selectedOptions.map((option) => (
                  <li key={`${item.key}-${option.id}`}>
                    {option.typeLabel}:{' '}
                    <span className="text-zinc-300">{option.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
          >
            Ukloni
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <CartQuantityControl
            quantity={item.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            compact={compact}
          />

          <div className="text-right">
            <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Ukupno
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              {formatCartPrice(item.unitPrice * item.quantity)}{' '}
              {CURRENCY.symbol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
