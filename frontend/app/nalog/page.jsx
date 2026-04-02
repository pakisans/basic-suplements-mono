'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { updateMe } from '@/services/auth'
import { ROUTES } from '@/constants'

export default function AccountPage() {
  const { user, token, loading, logout, refreshUser } = useAuth()
  const router = useRouter()

  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace(ROUTES.login)
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) setName(user.name ?? '')
  }, [user])

  async function handleSave(e) {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess(false)
    setSaving(true)
    try {
      await updateMe(token, user.id, { name })
      await refreshUser()
      setEditMode(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    router.push('/')
  }

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
          Zdravo, {user.name || 'korisniče'}
        </h1>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar nav */}
        <nav className="space-y-1">
          {[
            { label: 'Profil', href: ROUTES.account, active: true },
            { label: 'Porudžbine', href: ROUTES.orders },
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
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full border-l-2 border-transparent py-2 pl-4 text-left text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:border-red-500 hover:text-red-400"
          >
            Odjavi se
          </button>
        </nav>

        {/* Main content */}
        <div className="space-y-8">
          {/* Profile section */}
          <section className="border border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Lični podaci
              </h2>
              {!editMode && (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
                >
                  Izmeni
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                    Ime i prezime
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white focus:border-zinc-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="h-11 w-full border border-zinc-900 bg-zinc-950/50 px-4 text-sm text-zinc-600"
                  />
                </div>

                {saveError && <p className="text-xs text-red-400">{saveError}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 bg-white px-6 text-xs font-medium tracking-widest text-black uppercase transition-colors hover:bg-zinc-200 disabled:opacity-50"
                  >
                    {saving ? 'Čuvanje...' : 'Sačuvaj'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditMode(false); setName(user.name ?? '') }}
                    className="h-10 border border-zinc-800 px-6 text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
                  >
                    Otkaži
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                {saveSuccess && (
                  <p className="text-xs text-green-400">Podaci su uspešno sačuvani</p>
                )}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <span className="text-xs text-zinc-500">Ime</span>
                  <span className="text-sm text-white">{user.name || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Email</span>
                  <span className="text-sm text-white">{user.email}</span>
                </div>
              </div>
            )}
          </section>

          {/* Recent orders preview */}
          <section className="border border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Poslednje porudžbine
              </h2>
              <Link
                href={ROUTES.orders}
                className="text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
              >
                Sve porudžbine
              </Link>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500">Još nema porudžbina</p>
              <Link
                href={ROUTES.products}
                className="mt-4 inline-block text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
              >
                Idi na proizvode →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
