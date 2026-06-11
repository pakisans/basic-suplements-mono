'use client';

import { useMemo, useState } from 'react';
import { PayloadImage } from '@/components/ui/PayloadImage';

function itemMatchesOptions(item, wantedIds) {
  const options = item?.variantOption;
  if (!options) return false;
  // hasMany → array of option objects or IDs
  const arr = Array.isArray(options) ? options : [options];
  return arr.some((opt) => {
    const id = opt && typeof opt === 'object' ? opt.id : opt;
    return wantedIds.has(String(id));
  });
}

export function ProductGallery({
  gallery,
  productTitle,
  activeOptionIds = [],
}) {
  const items = useMemo(() => gallery ?? [], [gallery]);

  // Stable signature of the current selection so memo/effect don't re-run on
  // every render (activeOptionIds is a fresh array each time).
  const activeKey = activeOptionIds.map(String).join(',');

  // Images belonging to the currently selected variation. When a variation is
  // selected we show ONLY its images; otherwise the full gallery is shown.
  const visibleItems = useMemo(() => {
    const wantedIds = new Set(activeKey ? activeKey.split(',') : []);
    if (!wantedIds.size) return items;
    const matching = items.filter((item) => itemMatchesOptions(item, wantedIds));
    return matching.length ? matching : items;
  }, [items, activeKey]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Jump back to the first image whenever the visible set (selection) changes.
  // Reset during render (React's recommended pattern), not in an effect.
  const visibleKey = visibleItems.map((item, i) => item?.id ?? i).join(',');
  const [prevKey, setPrevKey] = useState(visibleKey);
  if (prevKey !== visibleKey) {
    setPrevKey(visibleKey);
    setActiveIndex(0);
  }

  if (!visibleItems.length) {
    return (
      <div className="aspect-[4/5] bg-zinc-900" aria-label={productTitle} />
    );
  }

  const safeIndex = Math.min(activeIndex, visibleItems.length - 1);
  const activeItem = visibleItems[safeIndex];

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

      {visibleItems.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {visibleItems.map((item, index) => (
            <button
              key={item.id ?? index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden border transition-opacity ${index === safeIndex ? 'border-white opacity-100' : 'border-zinc-800 opacity-50 hover:opacity-80'}`}
            >
              <PayloadImage media={item.image} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
