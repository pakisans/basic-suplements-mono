'use client'

import { useState } from 'react'
import { isOptionAvailableForSelection } from '@/lib/cart/product'

const COLOR_MAP = {
  'Crna': '#1a1a1a',
  'Bela': '#f5f5f5',
  'Belo': '#f5f5f5',
  'Siva': '#6b7280',
  'Svetlo siva': '#9ca3af',
  'Tamno siva': '#374151',
  'Navy Blue': '#1e3a5f',
  'Plava': '#2563eb',
  'Sky Blue': '#38bdf8',
  'Roza': '#f472b6',
  'Crvena': '#ef4444',
  'Narandžasta': '#f97316',
  'Zelena': '#22c55e',
  'Mint': '#6ee7b7',
  'Bež': '#d4b896',
  'Ruby': '#9f1239',
  'Transparentna': 'transparent',
  'boja kapucina': '#7c5c3e',
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function ColorSwatch({ option, selected, available, onSelect }) {
  const hex = COLOR_MAP[option.label] ?? '#888888'
  const isLight = hex === '#f5f5f5' || hex === 'transparent'

  return (
    <button
      type="button"
      title={option.label}
      onClick={() => available && onSelect(option.id)}
      disabled={!available}
      className={`relative h-8 w-8 shrink-0 transition-all duration-150 ${
        selected
          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
          : available
            ? 'hover:scale-110 hover:ring-1 hover:ring-zinc-500 hover:ring-offset-1 hover:ring-offset-black'
            : 'opacity-30 cursor-not-allowed'
      }`}
      style={{ backgroundColor: hex }}
      aria-label={option.label}
      aria-pressed={selected}
    >
      {isLight && (
        <span className="absolute inset-0 border border-zinc-600" />
      )}
      {!available && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className="block h-px w-full rotate-45 bg-zinc-500"
            style={{ transformOrigin: 'center' }}
          />
        </span>
      )}
    </button>
  )
}

function SizeButton({ option, selected, available, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => available && onSelect(option.id)}
      disabled={!available}
      className={`min-w-[48px] h-10 px-3 border text-xs font-bold tracking-widest uppercase transition-all duration-150 active:scale-95 ${
        selected
          ? 'border-white bg-white text-black'
          : available
            ? 'border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
            : 'border-zinc-900 text-zinc-700 line-through opacity-40 cursor-not-allowed'
      }`}
    >
      {option.label}
    </button>
  )
}

function WeightPill({ option, selected, available, onSelect, basePrice }) {
  const priceDiff =
    typeof option.price === 'number' && typeof basePrice === 'number'
      ? option.price - basePrice
      : null

  return (
    <button
      type="button"
      onClick={() => available && onSelect(option.id)}
      disabled={!available}
      className={`flex flex-col items-center border px-5 py-2.5 text-xs transition-all duration-150 active:scale-95 ${
        selected
          ? 'border-white bg-white text-black'
          : available
            ? 'border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
            : 'border-zinc-900 text-zinc-700 opacity-40 cursor-not-allowed'
      }`}
    >
      <span className={`font-semibold ${selected ? 'text-black' : ''}`}>
        {option.label}
      </span>
      {priceDiff != null && priceDiff !== 0 && (
        <span className={`mt-0.5 text-[10px] ${selected ? 'text-zinc-600' : 'text-zinc-500'}`}>
          {priceDiff > 0 ? `+${priceDiff.toLocaleString('sr-RS')}` : priceDiff.toLocaleString('sr-RS')} RSD
        </span>
      )}
    </button>
  )
}

function FlavorGrid({ group, selectedOptionIds, product, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const COLLAPSE_THRESHOLD = 12
  const showToggle = group.options.length > COLLAPSE_THRESHOLD
  const visibleOptions =
    showToggle && !expanded ? group.options.slice(0, COLLAPSE_THRESHOLD) : group.options

  return (
    <div>
      <div
        className={`grid grid-cols-2 gap-2 sm:grid-cols-3 transition-all duration-300 ${
          !expanded && showToggle ? 'max-h-[220px] overflow-y-auto' : ''
        }`}
        style={
          !expanded && showToggle
            ? {
                scrollbarWidth: 'thin',
                scrollbarColor: '#27272a transparent',
              }
            : undefined
        }
      >
        {visibleOptions.map((option) => {
          const selected = selectedOptionIds.some(
            (id) => String(id) === String(option.id),
          )
          const available = isOptionAvailableForSelection(
            product,
            group.id,
            option.id,
            selectedOptionIds,
          )

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => available && onSelect(option.id)}
              disabled={!available}
              className={`text-left border px-3 py-2 text-xs transition-all duration-150 ${
                selected
                  ? 'border-white bg-white text-black'
                  : available
                    ? 'border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
                    : 'border-zinc-900 text-zinc-700 line-through opacity-40 cursor-not-allowed'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          {expanded
            ? 'Prikaži manje ↑'
            : `Prikaži sve (${group.options.length}) ↓`}
        </button>
      )}
    </div>
  )
}

export function VariantSelector({ group, selectedOptionIds, product, onSelect }) {
  const name = group.name?.toLowerCase() ?? ''

  function handleSelect(optionId) {
    onSelect(group, optionId)
  }

  if (name === 'boja') {
    return (
      <div className="flex flex-wrap gap-2.5">
        {group.options.map((option) => {
          const selected = selectedOptionIds.some(
            (id) => String(id) === String(option.id),
          )
          const available = isOptionAvailableForSelection(
            product,
            group.id,
            option.id,
            selectedOptionIds,
          )
          return (
            <ColorSwatch
              key={option.id}
              option={option}
              selected={selected}
              available={available}
              onSelect={handleSelect}
            />
          )
        })}
      </div>
    )
  }

  if (name === 'velicina') {
    const sorted = [...group.options].sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a.label.toUpperCase())
      const bi = SIZE_ORDER.indexOf(b.label.toUpperCase())
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })

    return (
      <div className="flex flex-wrap gap-2">
        {sorted.map((option) => {
          const selected = selectedOptionIds.some(
            (id) => String(id) === String(option.id),
          )
          const available = isOptionAvailableForSelection(
            product,
            group.id,
            option.id,
            selectedOptionIds,
          )
          return (
            <SizeButton
              key={option.id}
              option={option}
              selected={selected}
              available={available}
              onSelect={handleSelect}
            />
          )
        })}
      </div>
    )
  }

  if (name === 'tezina' || name === 'pakovanje') {
    const basePrice =
      typeof product?.salePrice === 'number'
        ? product.salePrice
        : typeof product?.price === 'number'
          ? product.price
          : null

    return (
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => {
          const selected = selectedOptionIds.some(
            (id) => String(id) === String(option.id),
          )
          const available = isOptionAvailableForSelection(
            product,
            group.id,
            option.id,
            selectedOptionIds,
          )
          return (
            <WeightPill
              key={option.id}
              option={option}
              selected={selected}
              available={available}
              onSelect={handleSelect}
              basePrice={basePrice}
            />
          )
        })}
      </div>
    )
  }

  if (name === 'ukus') {
    return (
      <FlavorGrid
        group={group}
        selectedOptionIds={selectedOptionIds}
        product={product}
        onSelect={handleSelect}
      />
    )
  }

  // Default fallback — generic pill buttons
  return (
    <div className="flex flex-wrap gap-2">
      {group.options.map((option) => {
        const selected = selectedOptionIds.some(
          (id) => String(id) === String(option.id),
        )
        const available = isOptionAvailableForSelection(
          product,
          group.id,
          option.id,
          selectedOptionIds,
        )
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => available && handleSelect(option.id)}
            disabled={!available}
            className={`border px-4 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-150 ${
              selected
                ? 'border-white bg-white text-black'
                : available
                  ? 'border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
                  : 'border-zinc-900 text-zinc-700 line-through opacity-40 cursor-not-allowed'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
