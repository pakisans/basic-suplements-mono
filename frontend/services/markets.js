import { PUBLIC_PAYLOAD_URL } from '@/constants'

export async function getMarkets() {
  try {
    const url = `${PUBLIC_PAYLOAD_URL}/api/markets?where[active][equals]=true&sort=order&limit=20&depth=0`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}
