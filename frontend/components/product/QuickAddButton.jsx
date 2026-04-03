'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import {
  createCartItem,
  getProductOptionGroups,
  getSelectedVariant,
  isOptionAvailableForSelection,
  productHasVariants,
} from '@/lib/cart/product';

export function QuickAddButton({ product }) {
  const { addItem } = useCart();
  const hasVariants = productHasVariants(product);
  const optionGroups = getProductOptionGroups(product);

  const [isOpen, setIsOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() =>
    optionGroups
      .filter((g) => g.options.length === 1)
      .map((g) => g.options[0].id),
  );

  const selectedVariant = getSelectedVariant(product, selectedIds);
  const allGroupsSelected = optionGroups.every((group) =>
    selectedIds.some((id) =>
      group.options.some((o) => String(o.id) === String(id)),
    ),
  );
  const canAdd =
    !hasVariants || (allGroupsSelected && Boolean(selectedVariant));

  const hasStock = selectedVariant
    ? (selectedVariant.inventory ?? null) === null ||
      selectedVariant.inventory > 0
    : true;

  function handleTrigger(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!hasStock) return;

    if (!hasVariants) {
      addItem(createCartItem(product, null, 1), { openCart: true });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }
    setIsOpen(true);
  }

  function handleClose(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  }

  function handleOptionSelect(e, group, optionId) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIds((prev) => {
      const without = prev.filter(
        (id) => !group.options.some((o) => String(o.id) === String(id)),
      );
      return [...without, optionId];
    });
  }

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!canAdd || !hasStock) return;
    addItem(createCartItem(product, selectedVariant, 1), { openCart: true });
    setIsOpen(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <div
        data-no-card-nav="true"
        className={`absolute inset-x-0 bottom-0 z-30 transition-transform duration-300 ${
          isOpen || added
            ? 'translate-y-0'
            : 'translate-y-full group-hover:translate-y-0'
        }`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleTrigger}
          onPointerDown={(e) => e.stopPropagation()}
          disabled={!hasStock}
          className={`flex h-11 w-full items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase backdrop-blur-sm transition-colors ${
            hasStock
              ? 'bg-white/95 text-black hover:bg-white'
              : 'bg-zinc-900/90 text-zinc-500'
          }`}
        >
          {added ? (
            <>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                />
              </svg>
              Dodato
            </>
          ) : !hasStock ? (
            'Nema na stanju'
          ) : (
            <>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              {hasVariants ? 'Izaberi opciju' : 'Brzo dodaj'}
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          data-no-card-nav="true"
          className="absolute inset-0 z-40 flex flex-col bg-zinc-950/98"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 border-b border-zinc-800/60 px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-medium tracking-widest text-zinc-600 uppercase">
                Brza korpa
              </p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug text-white">
                {product.title}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              onPointerDown={(e) => e.stopPropagation()}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-zinc-600 transition-colors hover:text-white"
              aria-label="Zatvori"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-3.5 w-3.5"
              >
                <path d="M3 3 13 13M13 3 3 13" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3">
            {optionGroups.map((group) => {
              const isGroupSelected = selectedIds.some((id) =>
                group.options.some((o) => String(o.id) === String(id)),
              );
              return (
                <div key={group.id}>
                  <p
                    className={`mb-1.5 text-[9px] font-medium tracking-widest uppercase ${
                      isGroupSelected ? 'text-zinc-600' : 'text-amber-400'
                    }`}
                  >
                    {isGroupSelected ? group.label : `↓ ${group.label}`}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.options.map((option) => {
                      const selected = selectedIds.some(
                        (id) => String(id) === String(option.id),
                      );
                      const available = isOptionAvailableForSelection(
                        product,
                        group.id,
                        option.id,
                        selectedIds,
                      );
                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={!available}
                          onClick={(e) =>
                            handleOptionSelect(e, group, option.id)
                          }
                          onPointerDown={(e) => e.stopPropagation()}
                          className={`border px-2.5 py-1 text-[11px] font-medium leading-none transition-colors ${
                            selected
                              ? 'border-white bg-white text-black'
                              : available
                                ? 'border-zinc-700 text-zinc-300 hover:border-zinc-400 hover:text-white'
                                : 'border-zinc-900 text-zinc-700 line-through'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-zinc-800/60 px-3.5 pb-3.5 pt-2.5">
            <button
              type="button"
              disabled={!canAdd || !hasStock}
              onClick={handleAdd}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-9 w-full bg-white text-[11px] font-semibold tracking-widest text-black uppercase transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {!hasStock
                ? 'Nema na stanju'
                : !canAdd
                  ? 'Izaberi opciju'
                  : 'Dodaj u korpu'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
