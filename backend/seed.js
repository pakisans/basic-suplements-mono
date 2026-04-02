#!/usr/bin/env node
/**
 * Basic Supplements — Payload CMS Seed Script
 * ─────────────────────────────────────────────
 * Kreira brand, kategorije, variant tipove/opcije i 88 proizvoda.
 *
 * Pokretanje:
 *   node seed.js
 *   ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpass node seed.js
 *
 * Zahtevi: Node.js ≥ 18, Payload CMS pokrenut na :3000
 */

import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

const BASE     = process.env.PAYLOAD_URL     || 'http://localhost:3000'
const EMAIL    = process.env.ADMIN_EMAIL     || 'admin@example.com'
const PASSWORD = process.env.ADMIN_PASSWORD  || 'password'
const LOCALE   = 'sr'

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

let jwt = null
const h = () => jwt ? { Authorization: `JWT ${jwt}` } : {}

async function req(method, path, body) {
  const url  = `${BASE}/api${path}`
  const form = body instanceof FormData
  const res  = await fetch(url, {
    method,
    headers: { ...(form ? {} : { 'Content-Type': 'application/json' }), ...h() },
    body: form ? body : body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json; try { json = JSON.parse(text) } catch { json = { _raw: text } }
  if (!res.ok) throw new Error(`${method} ${path} [${res.status}]: ${json?.errors?.[0]?.message || json?.message || text.slice(0, 120)}`)
  return json
}

async function login() {
  const r = await req('POST', '/users/login', { email: EMAIL, password: PASSWORD })
  jwt = r.token
  console.log(`✓  Ulogovan kao ${EMAIL}`)
}

async function findBySlug(col, slug) {
  try {
    const r = await req('GET', `/${col}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`)
    return r.docs?.[0] ?? null
  } catch { return null }
}

async function findByField(col, field, value) {
  try {
    const r = await req('GET', `/${col}?where[${field}][equals]=${encodeURIComponent(value)}&limit=1&depth=0`)
    return r.docs?.[0] ?? null
  } catch { return null }
}

async function create(col, payload) {
  const r = await req('POST', `/${col}?locale=${LOCALE}`, payload)
  return r.doc
}

async function upsertBySlug(col, slug, payload) {
  const ex = await findBySlug(col, slug)
  return ex ?? await create(col, payload)
}

async function upsertByField(col, field, value, payload) {
  const ex = await findByField(col, field, value)
  return ex ?? await create(col, payload)
}

async function uploadImage(url, alt) {
  // Provjeri da li već postoji po URL-u/filenamu
  const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg'
  const ex = await findByField('media', 'filename', filename)
  if (ex) return ex

  // Download
  let buf, mime
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(25000) })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      buf  = Buffer.from(await r.arrayBuffer())
      mime = r.headers.get('content-type') || 'image/jpeg'
      break
    } catch (e) {
      if (i === 3) { console.warn(`      ⚠  Slika preskočena: ${filename}`); return null }
      await sleep(1000 * i)
    }
  }

  // Upload
  const form = new FormData()
  form.append('file', new Blob([buf], { type: mime }), filename)
  form.append('alt', alt)
  try {
    const r = await req('POST', '/media', form)
    return r.doc
  } catch (e) {
    console.warn(`      ⚠  Upload nije uspio (${filename}): ${e.message}`)
    return null
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function slugify(s) {
  return s.toLowerCase()
    .replace(/[čć]/g, 'c').replace(/ž/g, 'z').replace(/š/g, 's').replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function cleanTitle(raw) {
  return raw.replace(/\s*[-–]\s*BASIC SUPPLEMENTS\s*/gi, '').replace(/\s{2,}/g, ' ').trim()
}

function lexical(text) {
  if (!text?.trim()) return null
  return {
    root: {
      type: 'root', version: 1, format: '', indent: 0, direction: 'ltr',
      children: text.split(/\n+/).map(s => s.trim()).filter(Boolean).map(para => ({
        type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr',
        textFormat: 0, textStyle: '',
        children: [{ type: 'text', version: 1, format: 0, style: '', mode: 'normal', detail: 0, text: para }],
      })),
    },
  }
}

// ─── Category map (scraped path → naša hijerarhija) ──────────────────────────

// Root kategorije kreiramo prve
const ROOTS = [
  { title: 'Suplementi',     slug: 'suplementi' },
  { title: 'Oprema',         slug: 'oprema' },
  { title: 'Zdrava Ishrana', slug: 'zdrava-ishrana' },
  { title: 'Akcije',         slug: 'akcije' },
]

// key = scraped categoryPath.join('/'), value = { parent (root/L1 title), title, slug }
const CAT_CFG = {
  // ── Suplementi L1 ──
  'PROTEINI':                      { parent: 'Suplementi',           title: 'Proteini',               slug: 'proteini' },
  'AMINOKISELINE':                 { parent: 'Suplementi',           title: 'Aminokiseline',           slug: 'aminokiseline' },
  'KREATINI':                      { parent: 'Suplementi',           title: 'Kreatini',                slug: 'kreatini' },
  'Pre workout':                   { parent: 'Suplementi',           title: 'Pre-Workout',             slug: 'pre-workout' },
  'VITAMINI I MINERALI':           { parent: 'Suplementi',           title: 'Vitamini i Minerali',     slug: 'vitamini-i-minerali' },
  'OMEGA 3 MASNE  KISELINE':       { parent: 'Suplementi',           title: 'Omega 3',                 slug: 'omega-3' },
  'SAGOREVAČI MASTI':              { parent: 'Suplementi',           title: 'Sagorevači Masti',        slug: 'sagorevaci-masti' },
  'STIMULATORI HORMONA':           { parent: 'Suplementi',           title: 'Stimulatori Hormona',     slug: 'stimulatori-hormona' },
  'BILJNI EKSTRATI':               { parent: 'Suplementi',           title: 'Biljni Ekstrakti',        slug: 'biljni-ekstrakti' },
  'ENERGETSKI I HIDRITIRAJUCI NAPITCI': { parent: 'Suplementi',     title: 'Napitci i Energetici',    slug: 'napitci-i-energetici' },
  // ── Suplementi L2 ──
  'PROTEINI/Kolagen':              { parent: 'Proteini',             title: 'Kolagen',                 slug: 'kolagen' },
  'AMINOKISELINE/L-Glutamine':     { parent: 'Aminokiseline',        title: 'L-Glutamine',             slug: 'l-glutamine' },
  'KREATINI/Kreatin Monohidrat':   { parent: 'Kreatini',             title: 'Kreatin Monohidrat',      slug: 'kreatin-monohidrat' },
  'VITAMINI I MINERALI/Ashwagandha':{ parent: 'Vitamini i Minerali', title: 'Ashwagandha',             slug: 'ashwagandha' },
  'VITAMINI I MINERALI/Koenzim Q10':{ parent: 'Vitamini i Minerali', title: 'Koenzim Q10',             slug: 'koenzim-q10' },
  'VITAMINI I MINERALI/Vitamin D3': { parent: 'Vitamini i Minerali', title: 'Vitamin D3',              slug: 'vitamin-d3' },
  'SAGOREVAČI MASTI/L-Carnitini i tečni sagorevačI': { parent: 'Sagorevači Masti', title: 'L-Carnitine', slug: 'l-carnitine' },
  'STIMULATORI HORMONA/Tribulusi': { parent: 'Stimulatori Hormona', title: 'Tribulus',                 slug: 'tribulus' },
  'STIMULATORI HORMONA/ZMA':       { parent: 'Stimulatori Hormona', title: 'ZMA',                     slug: 'zma-stimulatori' },
  'BILJNI EKSTRATI/Preparati za digestivni trakt': { parent: 'Biljni Ekstrakti', title: 'Digestivni Trakt', slug: 'digestivni-trakt' },
  // ── Oprema L1 ──
  'BB I FITNESS OPREMA':           { parent: 'Oprema',               title: 'BB i Fitness Oprema',     slug: 'bb-i-fitness-oprema' },
  // ── Oprema L2 ──
  'BB I FITNESS OPREMA/Bidoni i šejkeri /Flasice': { parent: 'BB i Fitness Oprema', title: 'Šejkeri i Bidoni', slug: 'sejkeri-i-bidoni' },
  'BB I FITNESS OPREMA/SPORTSKA GARDEROBA':        { parent: 'Oprema',              title: 'Sportska Garderoba', slug: 'sportska-garderoba' },
  // ── Zdrava Ishrana ──
  'Zdrava ishrana':                { parent: 'Zdrava Ishrana',       title: 'Zdrava Ishrana',          slug: 'zdrava-ishrana-sub' },
  'Zdrava ishrana/Proteinske   čokoladice': { parent: 'Zdrava Ishrana', title: 'Proteinske Čokoladice', slug: 'proteinske-cokoladice' },
  // ── Akcije ──
  'SUPER AKCIJE':                  { parent: 'Akcije',               title: 'Super Akcije',            slug: 'super-akcije' },
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱  Basic Supplements — Seed\n')

  await login()

  // ── Brand ──────────────────────────────────────────────────────────────────
  console.log('\n📦  Brand...')
  const brand = await upsertBySlug('brands', 'basic-supplements', {
    title: 'Basic Supplements',
    slug:  'basic-supplements',
    description: 'Premium sportska suplementacija iz EU. GMP, HACCP i HALAL sertifikovana.',
  })
  console.log(`  ✓ ${brand.title}  id=${brand.id}`)

  // ── Variant types ──────────────────────────────────────────────────────────
  console.log('\n🔀  Tipovi varijanti...')

  // variantTypes: { label, name }
  const vtUkus = await upsertByField('variantTypes', 'name', 'ukus', {
    label: 'Ukus', name: 'ukus',
  }).catch(e => { console.warn('  ⚠  variantTypes možda nisu dostupni:', e.message); return null })

  const vtVelicina = await upsertByField('variantTypes', 'name', 'velicina', {
    label: 'Veličina', name: 'velicina',
  }).catch(() => null)

  console.log(`  ✓ Ukus id=${vtUkus?.id ?? 'N/A'}, Veličina id=${vtVelicina?.id ?? 'N/A'}`)

  // ── Collect all variant options from scraped data ──────────────────────────
  const raw = JSON.parse(await readFile(join(__dir, 'products_scraped.json'), 'utf8'))

  const allUkus    = new Set()
  const allVelicina = new Set()
  for (const p of raw) {
    for (const v of p.variants || []) {
      if (v.type === 'ukus')     allUkus.add(v.name)
      if (v.type === 'veličina') allVelicina.add(v.name)
    }
  }

  // variantOptions: { variantType, label, value }
  const voUkusMap    = {}   // label → id
  const voVelMap     = {}   // label → id

  if (vtUkus) {
    console.log(`\n🎨  Opcije ukusa (${allUkus.size})...`)
    for (const name of allUkus) {
      const val = slugify(name)
      const vo = await upsertByField('variantOptions', 'value', `ukus-${val}`, {
        variantType: vtUkus.id,
        label: name,
        value: `ukus-${val}`,
      }).catch(() => null)
      if (vo) voUkusMap[name] = vo.id
    }
    console.log(`  ✓ ${Object.keys(voUkusMap).length}/${allUkus.size} opcija`)
  }

  if (vtVelicina) {
    console.log(`\n📐  Opcije veličina (${allVelicina.size})...`)
    for (const name of allVelicina) {
      const val = slugify(name)
      const vo = await upsertByField('variantOptions', 'value', `vel-${val}`, {
        variantType: vtVelicina.id,
        label: name,
        value: `vel-${val}`,
      }).catch(() => null)
      if (vo) voVelMap[name] = vo.id
    }
    console.log(`  ✓ ${Object.keys(voVelMap).length}/${allVelicina.size} opcija`)
  }

  // ── Kategorije ─────────────────────────────────────────────────────────────
  console.log('\n📂  Kategorije...')
  const catByTitle = {}   // title → id

  // Root
  for (const rc of ROOTS) {
    const c = await upsertBySlug('categories', rc.slug, { title: rc.title, slug: rc.slug })
    catByTitle[rc.title] = c.id
    console.log(`  ✓ [root] ${rc.title}`)
  }

  // L1 (parent = root)
  for (const [, cfg] of Object.entries(CAT_CFG)) {
    if (catByTitle[cfg.title]) continue
    const parentId = catByTitle[cfg.parent]
    if (!parentId) continue
    const c = await upsertBySlug('categories', cfg.slug, { title: cfg.title, slug: cfg.slug, parent: parentId })
    catByTitle[cfg.title] = c.id
    console.log(`  ✓ [L1]   ${cfg.title}`)
  }

  // L2 (parent = L1)
  for (const [, cfg] of Object.entries(CAT_CFG)) {
    if (catByTitle[cfg.title]) continue
    const parentId = catByTitle[cfg.parent]
    if (!parentId) continue
    const c = await upsertBySlug('categories', cfg.slug, { title: cfg.title, slug: cfg.slug, parent: parentId })
    catByTitle[cfg.title] = c.id
    console.log(`  ✓ [L2]   ${cfg.title}`)
  }

  // Helper: categoryPath → category IDs
  function catIds(path) {
    if (!path?.length) return []
    const fullKey = path.join('/')
    const cfg = CAT_CFG[fullKey]
    if (cfg && catByTitle[cfg.title]) return [catByTitle[cfg.title]]
    // Samo prva razina
    const cfg1 = CAT_CFG[path[0]]
    if (cfg1 && catByTitle[cfg1.title]) return [catByTitle[cfg1.title]]
    return []
  }

  // ── Proizvodi ──────────────────────────────────────────────────────────────
  console.log(`\n🛍️  Proizvodi (${raw.length})\n`)

  let okCount = 0, skipCount = 0, errCount = 0

  for (let i = 0; i < raw.length; i++) {
    const p      = raw[i]
    const title  = cleanTitle(p.title)
    const slug   = p.slug || slugify(title)
    const num    = `[${String(i + 1).padStart(2)}/${raw.length}]`

    process.stdout.write(`  ${num} ${title.slice(0, 55).padEnd(55)} `)

    // Preskoci ako već postoji
    const exists = await findBySlug('products', slug)
    if (exists) { process.stdout.write('PRESKOČEN\n'); skipCount++; continue }

    try {
      // Slike
      const gallery = []
      for (const imgUrl of p.images || []) {
        const media = await uploadImage(imgUrl, title)
        if (media) gallery.push({ image: media.id })
      }

      // Kategorije
      const categories = catIds(p.categoryPath || [])

      // Varijante
      const ukusVars = (p.variants || []).filter(v => v.type === 'ukus')
      const velVars  = (p.variants || []).filter(v => v.type === 'veličina')
      const hasVar   = (ukusVars.length > 0 && vtUkus) || (velVars.length > 0 && vtVelicina)

      const vtIds = []
      if (ukusVars.length > 0 && vtUkus)    vtIds.push(vtUkus.id)
      if (velVars.length > 0  && vtVelicina) vtIds.push(vtVelicina.id)

      // Highlights
      const highlights = (p.highlights || [])
        .filter(Boolean)
        .slice(0, 8)
        .map(h => ({ label: h.slice(0, 300) }))

      // Badges
      const badges = []
      if (p.salePrice !== null && p.salePrice !== undefined && p.salePrice !== p.price) {
        badges.push('sale')
      }

      // Product
      const doc = await create('products', {
        title,
        slug,
        price:     p.price ?? 0,
        ...(p.salePrice !== null && p.salePrice !== undefined && p.salePrice !== p.price
          ? { salePrice: p.salePrice }
          : {}),
        _status:       'published',
        brand:         brand.id,
        categories,
        gallery,
        description:   lexical(p.description),
        highlights,
        badges,
        enableVariants: hasVar ? true : false,
        ...(vtIds.length ? { variantTypes: vtIds } : {}),
        inventory:     hasVar ? 0 : 999,
        visibility:    'catalog',
      })

      const productId = doc?.id

      // Kreira variant dokumente
      if (hasVar && productId) {
        const voIds = [
          ...ukusVars.map(v => voUkusMap[v.name]).filter(Boolean),
          ...velVars.map(v => voVelMap[v.name]).filter(Boolean),
        ]

        // Svaka opcija postaje zaseban variant dokument
        for (const voId of voIds) {
          await create('variants', {
            product:   productId,
            options:   [voId],
            inventory: 100,
            _status:   'published',
          }).catch(() => null)
        }
      }

      process.stdout.write(`✓ (${gallery.length} sl, ${(ukusVars.length + velVars.length)} var)\n`)
      okCount++
    } catch (err) {
      process.stdout.write(`✗ ${err.message.slice(0, 60)}\n`)
      errCount++
    }

    await sleep(100)
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60))
  console.log('🏁  Seed završen!')
  console.log(`   ✓ Kreirano:    ${okCount}`)
  console.log(`   → Preskočeno:  ${skipCount}`)
  console.log(`   ✗ Grešaka:     ${errCount}`)
  console.log('─'.repeat(60) + '\n')
}

main().catch(err => {
  console.error('\n❌ Fatalna greška:', err.message)
  process.exit(1)
})
