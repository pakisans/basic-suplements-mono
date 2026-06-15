'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

type Cat = {
  id: number | string
  title: string
  slug: string
  sortOrder?: number
  parent?: { id: number | string } | number | string | null
}

const parentKey = (c: Cat): string => {
  if (!c.parent) return 'root'
  return String(typeof c.parent === 'object' ? c.parent.id : c.parent)
}

export const CategoryReorder: React.FC = () => {
  const [cats, setCats] = useState<Cat[] | null>(null)
  const [status, setStatus] = useState<string>('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/categories?limit=300&depth=1&sort=sortOrder', {
        credentials: 'include',
      })
      const data = await res.json()
      setCats((data.docs ?? []) as Cat[])
    } catch {
      setStatus('Could not load categories')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Group by parent, each group sorted by sortOrder then title.
  const groups = useMemo(() => {
    const map = new Map<string, Cat[]>()
    for (const c of cats ?? []) {
      const k = parentKey(c)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(c)
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title))
    }
    return map
  }, [cats])

  const persist = useCallback(async (list: Cat[]) => {
    setStatus('Saving…')
    try {
      await Promise.all(
        list.map((c, i) =>
          fetch(`/api/categories/${c.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sortOrder: i }),
          }),
        ),
      )
      setStatus('Saved ✓')
    } catch {
      setStatus('Save failed')
    }
    setTimeout(() => setStatus(''), 1800)
  }, [])

  const handleDrop = useCallback(
    (groupKey: string, targetId: string) => {
      if (!dragId || dragId === targetId || !cats) return
      const list = (groups.get(groupKey) ?? []).slice()
      const from = list.findIndex((c) => String(c.id) === dragId)
      const to = list.findIndex((c) => String(c.id) === targetId)
      if (from === -1 || to === -1) return

      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)

      // Reassign sortOrder by new position and reflect in flat state immediately.
      const orderById = new Map(list.map((c, i) => [String(c.id), i]))
      setCats(
        cats.map((c) =>
          orderById.has(String(c.id)) ? { ...c, sortOrder: orderById.get(String(c.id))! } : c,
        ),
      )
      setDragId(null)
      void persist(list)
    },
    [dragId, cats, groups, persist],
  )

  const rootList = groups.get('root') ?? []

  // Recursive tree: a row + its children nested underneath. Reordering only
  // happens among siblings of the same parent (groupKey), which is also how
  // sortOrder is scoped.
  const renderNode = (c: Cat, groupKey: string, depth: number): React.ReactNode => {
    const children = groups.get(String(c.id)) ?? []
    return (
      <li key={String(c.id)} style={{ listStyle: 'none' }}>
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation()
            setDragId(String(c.id))
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleDrop(groupKey, String(c.id))
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 10px',
            marginBottom: 4,
            marginLeft: depth * 22,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background:
              dragId === String(c.id) ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
            cursor: 'grab',
          }}
        >
          <span aria-hidden style={{ opacity: 0.5 }}>
            ⠿
          </span>
          <span style={{ flex: 1 }}>{c.title}</span>
          <span style={{ opacity: 0.45, fontSize: 12 }}>{c.slug}</span>
        </div>
        {children.length > 0 && (
          <ul style={{ margin: 0, padding: 0 }}>
            {children.map((child) => renderNode(child, String(c.id), depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div style={{ margin: '0 0 24px' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 4,
          background: 'var(--theme-elevation-50)',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        {open ? '▾' : '▸'} Reorder categories (drag & drop)
        {status && <em style={{ opacity: 0.7, fontStyle: 'normal' }}>— {status}</em>}
      </button>

      {open && (
        <div
          style={{
            marginTop: 12,
            padding: 16,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            background: 'var(--theme-elevation-0)',
          }}
        >
          <p style={{ margin: '0 0 12px', opacity: 0.7, fontSize: 13 }}>
            Drag to reorder. Changes save automatically.
          </p>

          {cats === null ? (
            <p style={{ opacity: 0.6 }}>Loading…</p>
          ) : (
            <ul style={{ margin: 0, padding: 0 }}>
              {rootList.map((c) => renderNode(c, 'root', 0))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
