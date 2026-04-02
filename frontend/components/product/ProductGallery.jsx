'use client';

import { useState } from 'react';
import { PayloadImage } from '@/components/ui/PayloadImage';

export function ProductGallery({
  gallery,
  productTitle,
  activeOptionIds = [],
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = gallery ?? [];
  const matchingIndex = activeOptionIds.length
    ? items.findIndex((item) => {
        const option = item?.variantOption;

        if (option && typeof option === 'object') {
          return activeOptionIds.includes(option.id);
        }

        return activeOptionIds.includes(option);
      })
    : -1;
  const resolvedIndex =
    matchingIndex >= 0
      ? matchingIndex
      : Math.min(activeIndex, Math.max(items.length - 1, 0));
  const activeItem = items[resolvedIndex];

  if (!items.length) {
    return (
      <div className="aspect-[4/5] bg-zinc-900" aria-label={productTitle} />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
        <PayloadImage
          media={activeItem?.image}
          fill
          className="object-cover"
          priority
        />
      </div>

      {items.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {items.map((item, index) => (
            <button
              key={item.id ?? index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden border transition-opacity ${index === resolvedIndex ? 'border-white opacity-100' : 'border-zinc-800 opacity-50 hover:opacity-80'}`}
            >
              <PayloadImage media={item.image} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
