'use client'

import { Suspense, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { ROUTES } from '@/constants'
import { buildProductPath } from '@/services/products'

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightText({ text, query, className = '' }) {
  const content = String(text ?? '')
  const trimmedQuery = query.trim()
  const normalizedQuery = trimmedQuery.toLowerCase()

  if (!trimmedQuery) {
    return <span className={className}>{content}</span>
  }

  const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'ig')
  const parts = content.split(regex)

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === normalizedQuery ? (
          <mark key={`${part}-${index}`} className="bg-white px-1 text-black">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </span>
  )
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
  const [activeTab, setActiveTab] = useState('all')
  const [isPending, startTransition] = useTransition()
  const abortRef = useRef(null)

  useEffect(() => {
    setInputValue(query)
  }, [query])

  useEffect(() => {
    setActiveTab('all')
  }, [query])

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      abortRef.current?.abort()
      setProducts([])
      setPosts([])
      setSearched(false)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setSearched(true)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!res.ok) throw new Error('Search request failed')

        const data = await res.json()

        if (!controller.signal.aborted) {
          setProducts(data.products ?? [])
          setPosts(data.posts ?? [])
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setProducts([])
          setPosts([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 180)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  function handleSubmit(e) {
    e.preventDefault()
    const nextQuery = inputValue.trim()

    startTransition(() => {
      if (!nextQuery) {
        router.replace(ROUTES.search)
        return
      }

      router.replace(`${ROUTES.search}?q=${encodeURIComponent(nextQuery)}`)
    })
  }

  function handleInputChange(e) {
    const nextValue = e.target.value
    setInputValue(nextValue)

    startTransition(() => {
      if (!nextValue.trim()) {
        router.replace(ROUTES.search)
        return
      }

      router.replace(`${ROUTES.search}?q=${encodeURIComponent(nextValue.trim())}`)
    })
  }

  const totalResults = products.length + posts.length
  const hasProducts = products.length > 0
  const hasPosts = posts.length > 0
  const visibleProducts = activeTab === 'posts' ? [] : products
  const visiblePosts = activeTab === 'products' ? [] : posts

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
          onChange={handleInputChange}
          placeholder="Unesi naziv proizvoda, branda, teme..."
          autoFocus
          className="h-14 flex-1 border border-r-0 border-zinc-800 bg-zinc-950 px-6 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-14 border border-zinc-800 bg-zinc-900 px-8 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black"
        >
          Traži
        </button>
      </form>

      {searched && !loading && totalResults > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: 'all', label: `Sve (${totalResults})` },
            { key: 'products', label: `Proizvodi (${products.length})`, disabled: !hasProducts },
            { key: 'posts', label: `Blog (${posts.length})`, disabled: !hasPosts },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full border px-4 py-2 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors ${
                activeTab === tab.key
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-16 text-center text-sm text-zinc-500">Pretraga...</div>
      )}

      {!loading && searched && totalResults === 0 && (
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-400">
            Nema rezultata za <span className="text-white">&quot;{query}&quot;</span>
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

      {!loading && visibleProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Proizvodi ({products.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={buildProductPath(product)}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  {product.gallery?.[0]?.image && (
                    <PayloadImage
                      media={product.gallery[0].image}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <HighlightText
                    text={product.title}
                    query={query}
                    className="text-sm font-medium text-white transition-opacity group-hover:opacity-70"
                  />
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

      {!loading && visiblePosts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Blog ({posts.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visiblePosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 border border-zinc-900 p-4 transition-colors hover:border-zinc-700"
              >
                {post.featuredImage && (
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-zinc-900">
                    <PayloadImage
                      media={post.featuredImage}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <HighlightText
                    text={post.title}
                    query={query}
                    className="text-sm font-medium text-white transition-opacity group-hover:opacity-70"
                  />
                  {post.meta?.description && (
                    <HighlightText
                      text={post.meta.description}
                      query={query}
                      className="mt-1.5 line-clamp-2 text-xs text-zinc-500"
                    />
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
