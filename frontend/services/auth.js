import { PAYLOAD_URL } from '@/constants'

const API = `${PAYLOAD_URL}/api/users`

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Neispravni podaci za prijavu')
  return data // { token, user, exp }
}

export async function logoutUser(token) {
  await fetch(`${API}/logout`, {
    method: 'POST',
    headers: token ? { Authorization: `JWT ${token}` } : {},
    cache: 'no-store',
  }).catch(() => {})
}

export async function getMe(token) {
  if (!token) return null
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.user ?? null
}

export async function registerUser({ name, email, password }) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) {
    const msg =
      data.message ||
      data.errors?.[0]?.message ||
      'Greška pri registraciji'
    throw new Error(msg)
  }
  return loginUser(email, password)
}

export async function updateMe(token, id, updates) {
  if (!token) throw new Error('Nije prijavljen')
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(updates),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Greška pri ažuriranju')
  return data.doc ?? data
}
