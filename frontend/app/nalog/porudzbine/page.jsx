'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { ROUTES } from '@/constants'

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.login)
  }, [loading, user, router])

  if (loading) {
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
        <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Nalog
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Moje porudžbine
        </h1>
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
        </div>
      </div>
    </div>
  )
}
