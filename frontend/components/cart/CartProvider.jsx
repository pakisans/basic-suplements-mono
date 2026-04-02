'use client'

import React, { createContext, useContext, useEffect, useEffectEvent, useReducer } from 'react'
import { getCartSubtotal } from '@/lib/cart/product'

const STORAGE_KEY = 'payload-next-cart'

const CartContext = createContext(null)

function normalizeCartItem(item) {
  if (!item || typeof item !== 'object') return null
  if (!item.key || !item.productId || !item.title) return null

  return {
    key: String(item.key),
    productId: item.productId,
    productSlug: typeof item.productSlug === 'string' ? item.productSlug : '',
    productPath: typeof item.productPath === 'string' ? item.productPath : '/proizvodi',
    title: String(item.title),
    variantId: item.variantId ?? null,
    selectedOptions: Array.isArray(item.selectedOptions)
      ? item.selectedOptions
          .filter((option) => option && typeof option === 'object')
          .map((option) => ({
            id: option.id ?? null,
            label: option.label ?? option.value ?? 'Opcija',
            value: option.value ?? option.label ?? 'Opcija',
            typeId: option.typeId ?? null,
            typeLabel: option.typeLabel ?? 'Opcija',
            typeName: option.typeName ?? 'option',
          }))
      : [],
    image: item.image && typeof item.image === 'object'
      ? {
          url: item.image.url ?? null,
          alt: item.image.alt ?? '',
          width: item.image.width ?? null,
          height: item.image.height ?? null,
        }
      : null,
    unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : 0,
    quantity: Math.max(1, Number.parseInt(item.quantity ?? 1, 10) || 1),
    sku: typeof item.sku === 'string' ? item.sku : null,
  }
}

function readStoredItems() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map(normalizeCartItem).filter(Boolean)
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return {
        ...state,
        items: action.items,
        isHydrated: true,
      }
    case 'open':
      return { ...state, isOpen: true }
    case 'close':
      return { ...state, isOpen: false }
    case 'toggle':
      return { ...state, isOpen: !state.isOpen }
    case 'add': {
      const nextItems = [...state.items]
      const index = nextItems.findIndex((item) => item.key === action.item.key)

      if (index >= 0) {
        nextItems[index] = {
          ...nextItems[index],
          quantity: nextItems[index].quantity + action.item.quantity,
        }
      } else {
        nextItems.unshift(action.item)
      }

      return {
        ...state,
        items: nextItems,
        isOpen: action.openCart ? true : state.isOpen,
      }
    }
    case 'updateQuantity':
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === action.key
            ? { ...item, quantity: Math.max(1, action.quantity) }
            : item,
        ),
      }
    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => item.key !== action.key),
      }
    case 'clear':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    isOpen: false,
    isHydrated: false,
  })

  useEffect(() => {
    dispatch({
      type: 'hydrate',
      items: readStoredItems(),
    })
  }, [])

  useEffect(() => {
    if (!state.isHydrated || typeof window === 'undefined') return

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.isHydrated, state.items])

  const handleStorage = useEffectEvent((event) => {
    if (event.key !== STORAGE_KEY) return

    dispatch({
      type: 'hydrate',
      items: readStoredItems(),
    })
  })

  useEffect(() => {
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = getCartSubtotal(state.items)

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    isHydrated: state.isHydrated,
    itemCount,
    subtotal,
    openCart() {
      dispatch({ type: 'open' })
    },
    closeCart() {
      dispatch({ type: 'close' })
    },
    toggleCart() {
      dispatch({ type: 'toggle' })
    },
    addItem(item, options = {}) {
      const normalized = normalizeCartItem(item)
      if (!normalized) return

      dispatch({
        type: 'add',
        item: normalized,
        openCart: options.openCart ?? false,
      })
    },
    updateQuantity(key, quantity) {
      dispatch({
        type: 'updateQuantity',
        key,
        quantity,
      })
    },
    removeItem(key) {
      dispatch({
        type: 'remove',
        key,
      })
    },
    clearCart() {
      dispatch({ type: 'clear' })
    },
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
