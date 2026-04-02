'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getMe, loginUser, logoutUser, registerUser } from '@/services/auth'

const TOKEN_KEY = 'payload-auth-token'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    if (!stored) { setLoading(false); return }

    getMe(stored).then((u) => {
      if (u) { setUser(u); setToken(stored) }
      else localStorage.removeItem(TOKEN_KEY)
      setLoading(false)
    })
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem(TOKEN_KEY, data.token)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await logoutUser(token)
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }, [token])

  const register = useCallback(async (fields) => {
    const data = await registerUser(fields)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem(TOKEN_KEY, data.token)
    return data.user
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return
    const u = await getMe(token)
    if (u) setUser(u)
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
