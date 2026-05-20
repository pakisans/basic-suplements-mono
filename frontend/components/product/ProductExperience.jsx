'use client';

import { useEffect, useState } from 'react';
import { ProductGallery } from './ProductGallery';
import { ProductPrice } from './ProductPrice';
import { ProductDetails } from './ProductDetails';
import { Button } from '@/components/ui/Button';
import { VariantSelector } from './VariantSelector';
import { useCart } from '@/components/cart/CartProvider';
import { useCatalogMode } from '@/components/catalog/CatalogModeProvider';
import {
  createCartItem,
  getDisplayPrice,
  getProductOptionGroups,
  getSelectedImage,
  getSelectedOptionIds,
  getSelectedVariant,
  productHasVariants,
} from '@/lib/cart/product';

const COLOR_MAP = {
  // Serbian names
  Crna: '#1a1a1a',
  Bela: '#f5f5f5',
  Belo: '#f5f5f5',
  Siva: '#6b7280',
  'Svetlo siva': '#9ca3af',
  'Tamno siva': '#374151',
  Plava: '#2563eb',
  Roza: '#f472b6',
  Crvena: '#ef4444',
  Narandžasta: '#f97316',
  Zelena: '#22c55e',
  Bež: '#d4b896',
  Transparentna: 'transparent',
  'boja kapucina': '#7c5c3e',
  // English names
  Black: '#1a1a1a',
  White: '#f5f5f5',
  Gray: '#6b7280',
  Grey: '#6b7280',
  'Light Gray': '#9ca3af',
  'Light Grey': '#9ca3af',
  'Dark Gray': '#374151',
  'Dark Grey': '#374151',
  'Navy Blue': '#1e3a5f',
  Blue: '#2563eb',
  'Sky Blue': '#38bdf8',
  Pink: '#f472b6',
  Red: '#ef4444',
  Orange: '#f97316',
  Green: '#22c55e',
  Mint: '#6ee7b7',
  Beige: '#d4b896',
  Ruby: '#9f1239',
  Transparent: 'transparent',
  Cappuccino: '#7c5c3e',
};

function getInitialSelection(optionGroups) {
  return optionGroups
    .filter((group) => group.options.length === 1)
    .map((group) => group.options[0].id);
}

export function ProductExperience({ product }) {
  const { addItem } = useCart();
  const { isCatalogOnly, resetGate } = useCatalogMode();
  const optionGroups = getProductOptionGroups(product);
  const hasVariants = productHasVariants(product);
  const [selectedOptionIds, setSelectedOptionIds] = useState(() =>
    getInitialSelection(optionGroups),
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedVariant = getSelectedVariant(product, selectedOptionIds);
  const selectedImage = getSelectedImage(
    product,
    selectedVariant ? getSelectedOptionIds(selectedVariant) : selectedOptionIds,
  );

  const missingSelection =
    hasVariants &&
    optionGroups.some((group) => {
      return !selectedOptionIds.some((selectedId) =>
        group.options.some(
          (option) => String(option.id) === String(selectedId),
        ),
      );
    });

  const hasStock = hasVariants
    ? selectedVariant
      ? selectedVariant.inventory === null ||
        selectedVariant.inventory === undefined ||
        selectedVariant.inventory > 0
      : true
    : true;

  const canAddToCart = hasVariants
    ? !missingSelection && Boolean(selectedVariant) && hasStock
    : hasStock;
  const displayPrice = getDisplayPrice(product, selectedVariant);

  // Variant is fully resolved (all groups selected, or product has no variants)
  const variantResolved =
    !hasVariants || (!missingSelection && Boolean(selectedVariant));

  function handleOptionSelect(group, optionId) {
    setError('');
    setSuccess('');
    setSelectedOptionIds((current) => {
      const withoutGroup = current.filter((selectedId) => {
        return !group.options.some(
          (option) => String(option.id) === String(selectedId),
        );
      });
      return [...withoutGroup, optionId];
    });
  }

  function handleAddToCart() {
    if (missingSelection) {
      setError('Please select all required options before adding to cart.');
      setSuccess('');
      return;
    }

    if (hasVariants && !selectedVariant) {
      setError('The selected combination is currently unavailable.');
      setSuccess('');
      return;
    }

    if (!hasStock) {
      setError('The selected variant is currently out of stock.');
      setSuccess('');
      return;
    }

    addItem(createCartItem(product, selectedVariant, quantity), {
      openCart: true,
    });

    const msg =
      quantity > 1
        ? `Added ${quantity} items to cart.`
        : 'Product added to cart.';
    setSuccess(msg);
    setError('');

    setTimeout(() => setSuccess(''), 3000);
  }

  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  const galleryWithFallback =
    selectedImage && !gallery.length ? [{ image: selectedImage }] : gallery;

  // Find selected color option for inline swatch in label
  function getSelectedColorHex(group) {
    const selected = group.options.find((o) =>
      selectedOptionIds.some((id) => String(id) === String(o.id)),
    );
    return selected ? (COLOR_MAP[selected.label] ?? null) : null;
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery
        gallery={galleryWithFallback}
        productTitle={product.title}
        activeOptionIds={
          selectedVariant
            ? getSelectedOptionIds(selectedVariant)
            : selectedOptionIds
        }
      />

      <div className="flex flex-col gap-5">
        {product.brand && typeof product.brand !== 'string' && (
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
            {product.brand.title}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {product.title}
        </h1>
        {!isCatalogOnly && <ProductPrice price={displayPrice} size="xl" />}

        <div className="border-t border-zinc-900 pt-5">
          <ProductDetails product={product} />
        </div>

        {optionGroups.length > 0 && (
          <div className="space-y-5 border-t border-zinc-900 pt-5">
            {optionGroups.map((group) => {
              const selectedOption = group.options.find((o) =>
                selectedOptionIds.some((id) => String(id) === String(o.id)),
              );
              const isGroupSelected = Boolean(selectedOption);
              const isColorGroup = group.name?.toLowerCase() === 'boja' || group.name?.toLowerCase() === 'color';
              const colorHex = isColorGroup ? getSelectedColorHex(group) : null;

              return (
                <div key={group.id}>
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                    {isGroupSelected ? (
                      <>
                        <span className="text-zinc-500">{group.label}:</span>
                        {isColorGroup && colorHex && (
                          <span
                            className="inline-block h-3.5 w-3.5 border border-zinc-600"
                            style={{ backgroundColor: colorHex }}
                          />
                        )}
                        <span className="text-white">
                          {selectedOption.label}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-400">
                          Select {group.label}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      </>
                    )}
                  </div>
                  <VariantSelector
                    group={group}
                    selectedOptionIds={selectedOptionIds}
                    product={product}
                    onSelect={handleOptionSelect}
                  />
                </div>
              );
            })}
          </div>
        )}

        {!isCatalogOnly && (
          <div className="border-t border-zinc-900 pt-5">
            <div className="mb-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Quantity
            </div>
            <div className="inline-flex border border-zinc-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center border-r border-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white active:scale-95"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="flex h-12 min-w-[3rem] items-center justify-center px-4 text-sm font-semibold text-white">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-12 w-12 items-center justify-center border-l border-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        )}

        {!isCatalogOnly && variantResolved && (
          <div className="flex items-center gap-2">
            {hasStock ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-400">In stock</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs text-red-400">Out of stock</span>
              </>
            )}
          </div>
        )}

        {!isCatalogOnly && (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              fullWidth
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              {!hasStock
                ? 'Out of stock'
                : missingSelection
                  ? 'Select options'
                  : 'Add to cart'}
            </Button>
          </div>
        )}

        {!isCatalogOnly && error && <p className="text-sm text-red-400">{error}</p>}
        {!isCatalogOnly && success && (
          <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-400">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-emerald-400">{success}</p>
          </div>
        )}

        {isCatalogOnly && (
          <div className="border border-dashed border-zinc-700 px-5 py-4 text-center">
            <p className="text-sm text-zinc-400">
              To purchase, please{' '}
              <button
                onClick={resetGate}
                className="underline underline-offset-2 transition-colors hover:text-white"
              >
                select your country
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
