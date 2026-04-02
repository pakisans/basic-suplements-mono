'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { PAYLOAD_URL, ROUTES } from '@/constants'
import { buildProductPath } from '@/services/products'

async function fetchProducts(query) {
  const params = new URLSearchParams({
    'where[title][like]': query,
    'where[_status][equals]': 'published',
    limit: '12',
    depth: '1',
    locale: 'sr',
  })
  const res = await fetch(`${PAYLOAD_URL}/api/products?${params}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs ?? []
}

async function fetchPosts(query) {
  const params = new URLSearchParams({
    'where[title][like]': query,
    'where[_status][equals]': 'published',
    limit: '4',
    depth: '1',
    locale: 'sr',
  })
  const res = await fetch(`${PAYLOAD_URL}/api/posts?${params}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs ?? []
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(query)
  const [products, setProducts] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setProducts([]); setPosts([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    const [p, b] = await Promise.all([fetchProducts(q), fetchPosts(q)])
    setProducts(p)
    setPosts(b)
    setLoading(false)
  }, [])

  useEffect(() => {
    setInputValue(query)
    doSearch(query)
  }, [query, doSearch])

  function handleSubmit(e) {
    e.preventDefault()
    if (!inputValue.trim()) return
    router.push(`${ROUTES.search}?q=${encodeURIComponent(inputValue.trim())}`)
  }

  const totalResults = products.length + posts.length

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-900 pb-8">
        <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Pretraga
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {query ? `Rezultati za "${query}"` : 'Pronađi šta tražiš'}
        </h1>
        {searched && !loading && (
          <p className="mt-2 text-sm text-zinc-500">
            {totalResults > 0 ? `${totalResults} rezultata` : 'Nema rezultata'}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex">
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Unesi naziv proizvoda, branda, teme..."
          autoFocus
          className="h-14 flex-1 border border-r-0 border-zinc-800 bg-zinc-950 px-6 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
        <button
          type="submit"
          className="h-14 border border-zinc-800 bg-zinc-900 px-8 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black"
        >
          Traži
        </button>
      </form>

      {loading && (
        <div className="mt-16 text-center text-sm text-zinc-500">Pretraga...</div>
      )}

      {!loading && searched && totalResults === 0 && (
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-400">
            Nema rezultata za <span className="text-white">"{query}"</span>
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            Pokušaj sa drugačijim pojmom ili pregledaj naš katalog
          </p>
          <Link
            href={ROUTES.products}
            className="mt-6 inline-block text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
          >
            Pogledaj sve proizvode →
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Proizvodi ({products.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={buildProductPath(product)}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  {product.images?.[0]?.image && (
                    <PayloadImage
                      media={product.images[0].image}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <div className="text-sm font-medium text-white transition-opacity group-hover:opacity-70">
                    {product.title}
                  </div>
                  {product.price != null && (
                    <div className="text-sm text-zinc-400">
                      {product.price.toLocaleString('sr-RS')} RSD
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!loading && posts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Blog ({posts.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 border border-zinc-900 p-4 transition-colors hover:border-zinc-700"
              >
                {post.heroImage && (
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-zinc-900">
                    <PayloadImage
                      media={post.heroImage}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white transition-opacity group-hover:opacity-70">
                    {post.title}
                  </div>
                  {post.meta?.description && (
                    <div className="mt-1.5 line-clamp-2 text-xs text-zinc-500">
                      {post.meta.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!query && !loading && (
        <div className="mt-16 text-center text-sm text-zinc-600">
          Unesi pojam iznad da bi pokrenuo pretragu
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-sm text-zinc-500">Učitavanje...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
