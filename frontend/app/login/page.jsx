'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { ROUTES } from '@/constants'

export default function LoginPage() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' })

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      router.push(ROUTES.account)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (registerForm.password !== registerForm.confirm) {
      setError('Lozinke se ne poklapaju')
      return
    }
    if (registerForm.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera')
      return
    }
    setLoading(true)
    try {
      await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      })
      router.push(ROUTES.account)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Dobrodošli
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {tab === 'login' ? 'Prijavi se' : 'Kreiraj nalog'}
          </h1>
        </div>

        <div className="mb-8 flex border border-zinc-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setError('') }}
            className={`flex-1 py-2.5 text-xs font-medium tracking-widest uppercase transition-colors ${
              tab === 'login'
                ? 'bg-white text-black'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Prijava
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError('') }}
            className={`flex-1 py-2.5 text-xs font-medium tracking-widest uppercase transition-colors ${
              tab === 'register'
                ? 'bg-white text-black'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Registracija
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                className="h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
                placeholder="ime@email.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Lozinka
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                className="h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-white text-xs font-medium tracking-widest text-black uppercase transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Prijavljivanje...' : 'Prijavi se'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Ime i prezime
              </label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                className="h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
                placeholder="Petar Petrović"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                className="h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
                placeholder="ime@email.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Lozinka
              </label>
              <input
                type="password"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                className="h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
                placeholder="Min. 6 karaktera"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Potvrdi lozinku
              </label>
              <input
                type="password"
                required
                value={registerForm.confirm}
                onChange={(e) => setRegisterForm((f) => ({ ...f, confirm: e.target.value }))}
                className="h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-white text-xs font-medium tracking-widest text-black uppercase transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Kreiranje naloga...' : 'Kreiraj nalog'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-zinc-600">
          Nastavkom prihvataš{' '}
          <Link href="/uslovi" className="text-zinc-400 hover:text-white">
            uslove korišćenja
          </Link>
        </p>
      </div>
    </div>
  )
}
