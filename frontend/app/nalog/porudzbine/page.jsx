'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { getMyOrders } from '@/services/orders'
import { CURRENCY, ROUTES } from '@/constants'

const STATUS_LABEL = {
  processing: 'U obradi',
  completed: 'Završena',
  cancelled: 'Otkazana',
  refunded: 'Refundirana',
}

const STATUS_CLASS = {
  processing: 'bg-amber-950/60 text-amber-400 border border-amber-900/40',
  completed: 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40',
  cancelled: 'bg-red-950/60 text-red-400 border border-red-900/40',
  refunded: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function OrdersPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.login)
  }, [loading, user, router])

  useEffect(() => {
    if (!token) return
    getMyOrders(token)
      .then(setOrders)
      .finally(() => setFetching(false))
  }, [token])

  if (loading || fetching) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-sm text-zinc-500">Učitavanje...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-900 pb-8">
        <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Nalog</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Moje porudžbine</h1>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1">
          {[
            { label: 'Profil', href: ROUTES.account },
            { label: 'Porudžbine', href: ROUTES.orders, active: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block border-l-2 py-2 pl-4 text-xs font-medium tracking-widest uppercase transition-colors ${
                item.active
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div>
          {orders.length === 0 ? (
            <div className="border border-zinc-800 p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-zinc-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-zinc-600">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6M9 16h4" />
                </svg>
              </div>
              <p className="text-sm text-zinc-400">Još nema porudžbina</p>
              <p className="mt-1 text-xs text-zinc-600">
                Kada završiš kupovinu, porudžbine će se pojaviti ovde
              </p>
              <Link
                href={ROUTES.products}
                className="mt-6 inline-block text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
              >
                Idi na proizvode →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const itemCount = order.items?.reduce((s, i) => s + (i.quantity ?? 1), 0) ?? 0
                const status = order.status ?? 'processing'
                const total = order.total ?? order.amount ?? null

                return (
                  <Link
                    key={order.id}
                    href={`${ROUTES.orders}/${order.id}`}
                    className="block border border-zinc-800 bg-zinc-950 p-5 transition-colors hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            Porudžbina #{order.id}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase ${STATUS_CLASS[status] ?? STATUS_CLASS.processing}`}>
                            {STATUS_LABEL[status] ?? status}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-4 text-xs text-zinc-500">
                          <span>{formatDate(order.createdAt)}</span>
                          <span>{itemCount} {itemCount === 1 ? 'artikal' : 'artikala'}</span>
                        </div>
                      </div>
                      {total != null && (
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-semibold text-white">
                            {total.toLocaleString('sr-RS')} {CURRENCY.symbol}
                          </div>
                        </div>
                      )}
                    </div>

                    {order.items?.length > 0 && (
                      <div className="mt-4 flex gap-2">
                        {order.items.slice(0, 4).map((item, idx) => {
                          const img = item.product?.gallery?.[0]?.image
                          return (
                            <div key={idx} className="relative h-12 w-10 shrink-0 overflow-hidden bg-zinc-900">
                              {img && (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${img.url}`}
                                  alt={item.product?.title ?? ''}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                          )
                        })}
                        {(order.items.length > 4) && (
                          <div className="flex h-12 w-10 items-center justify-center border border-zinc-800 text-xs text-zinc-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
