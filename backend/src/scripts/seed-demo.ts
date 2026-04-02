import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import type { File, Payload, PayloadRequest } from 'payload'
import { existsSync, readdirSync, readFileSync, rmSync } from 'fs'
import { dirname, extname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[čć]/g, 'c')
    .replace(/ž/g, 'z')
    .replace(/š/g, 's')
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function lexical(text: string) {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            format: 0,
            mode: 'normal',
            style: '',
            text: p,
            version: 1,
            detail: 0,
          },
        ],
        textFormat: 0,
        textStyle: '',
      })),
    },
  }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Two root categories — these appear on the homepage SplitHero
const CATEGORIES = [
  {
    title: 'Suplementi',
    slug: 'suplementi',
    description: 'Visokokvalitetni sportski suplementi za svaki cilj.',
    children: [
      { title: 'Proteini', slug: 'proteini', description: 'Whey, izolati i biljni proteini.' },
      { title: 'Pre-Workout', slug: 'pre-workout', description: 'Energija i fokus za maksimalan trening.' },
      { title: 'Kreatin', slug: 'kreatin', description: 'Kreatin monohidrat i napredne formule.' },
    ],
  },
  {
    title: 'Apparel',
    slug: 'apparel',
    description: 'Sportska odeća i oprema za gym i svakodnevni život.',
    children: [
      { title: 'Majice', slug: 'majice', description: 'Majice kratkih i dugih rukava.' },
      { title: 'Šorcevi i Helanke', slug: 'sorcevi-i-helanke', description: 'Komforni donji deo za trening.' },
    ],
  },
]

const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  suplementi: 'tshirt-white.png',
  apparel: 'tshirt-black.png',
}

const VARIANT_TYPES = [
  { name: 'ukus', label: 'Ukus' },
  { name: 'velicina', label: 'Veličina' },
  { name: 'boja', label: 'Boja' },
]

interface ProductDef {
  title: string
  slug: string
  price: number
  salePrice?: number
  category: string
  description: string
  highlights: string[]
  specifications: { label: string; value: string }[]
  variantType?: string
  variants: string[]
  badges: { label: string }[]
}

const PRODUCTS: ProductDef[] = [
  // ── PROTEINI ───────────────────────────────────────────────────────────────
  {
    title: 'IsoPRO',
    slug: 'isopro',
    price: 5999,
    salePrice: 4999,
    category: 'proteini',
    description:
      'IsoPRO je premium izolat whey proteina sa 90% čistog proteina po porciji.\n' +
      'Napravljen od najkvalitetnijeg mleka, bez laktoze i masti.\n' +
      'Savršen za oporavak nakon treninga i izgradnju čiste muskulature.',
    highlights: [
      '90% proteina po porciji',
      'Bez laktoze i masti',
      'Brza apsorpcija',
      '27g proteina po šejku',
    ],
    specifications: [
      { label: 'Proteini', value: '27g po porciji' },
      { label: 'Ugljeni hidrati', value: '2.1g' },
      { label: 'Masti', value: '0.5g' },
      { label: 'Pakovanje', value: '2kg' },
    ],
    variantType: 'ukus',
    variants: ['Čokolada', 'Vanila', 'Jagoda', 'Karamel', 'Lešnik'],
    badges: [{ label: 'Novo' }, { label: 'Akcija' }],
  },
  {
    title: 'PRO WHEY',
    slug: 'pro-whey',
    price: 4499,
    category: 'proteini',
    description:
      'PRO WHEY je koncentrat whey proteina visokog kvaliteta sa 78% proteina.\n' +
      'Idealan za svakodnevnu upotrebu i ubrzani oporavak mišića.\n' +
      'Bogat esencijalnim aminokiselinama i BCAA kompleksom.',
    highlights: [
      '78% proteina',
      'Bogat BCAA kompleksom',
      'Odličan ukus',
      '24g proteina po šejku',
    ],
    specifications: [
      { label: 'Proteini', value: '24g po porciji' },
      { label: 'Ugljeni hidrati', value: '4.8g' },
      { label: 'Masti', value: '2.1g' },
      { label: 'Pakovanje', value: '2kg' },
    ],
    variantType: 'ukus',
    variants: ['Čokolada', 'Vanila', 'Banana', 'Karamel', 'Cookies & Cream'],
    badges: [{ label: 'Bestseler' }],
  },
  {
    title: 'VEGAN PROTEIN',
    slug: 'vegan-protein',
    price: 4999,
    category: 'proteini',
    description:
      'VEGAN PROTEIN je mešavina biljnih proteina iz graška i pirinča.\n' +
      'Savršen za vegane i osobe sa intolerancijom na laktozu.\n' +
      'Puna aminokiselinska matrica bez kompromisa.',
    highlights: [
      '100% biljni proteini',
      'Bez laktoze i glutena',
      'Kompletan aminokiselinski profil',
      '22g proteina po šejku',
    ],
    specifications: [
      { label: 'Proteini', value: '22g po porciji' },
      { label: 'Ugljeni hidrati', value: '3.5g' },
      { label: 'Masti', value: '1.8g' },
      { label: 'Pakovanje', value: '1.5kg' },
    ],
    variantType: 'ukus',
    variants: ['Čokolada', 'Vanila', 'Šumsko Voće'],
    badges: [{ label: 'Vegan' }],
  },
  // ── PRE-WORKOUT ────────────────────────────────────────────────────────────
  {
    title: 'P-5',
    slug: 'p-5',
    price: 3499,
    category: 'pre-workout',
    description:
      'P-5 je naš premijum pre-workout formula sa 5 ključnih aktivnih jedinjenja.\n' +
      'Daje eksplozivnu energiju, fokus i neverovatnu pumpu za svaki trening.\n' +
      'Sadrži 200mg kofeina, beta-alanin, citrulin malat i još mnogo više.',
    highlights: [
      '5 aktivnih jedinjenja',
      '200mg kofeina',
      'Snažna pumpa i fokus',
      'Bez havarije energije',
    ],
    specifications: [
      { label: 'Kofein', value: '200mg' },
      { label: 'Citrulin malat', value: '6g' },
      { label: 'Beta-alanin', value: '3.2g' },
      { label: 'Pakovanje', value: '300g / 30 porcija' },
    ],
    variantType: 'ukus',
    variants: ['Watermelon', 'Blue Raspberry', 'Tropical Punch', 'Grape'],
    badges: [{ label: 'Novo' }],
  },
  {
    title: 'P-5 SHOT',
    slug: 'p-5-shot',
    price: 399,
    category: 'pre-workout',
    description:
      'P-5 SHOT je single-serve pre-workout u tečnom obliku.\n' +
      'Svaka bočica sadrži punu dozu aktivnih sastojaka za instant energiju.\n' +
      'Savršen za trening u pokretu — bez mešanja, bez čekanja.',
    highlights: [
      'Instant energija',
      'Single-serve bočica 60ml',
      'Puna doza bez šećera',
    ],
    specifications: [
      { label: 'Zapremina', value: '60ml' },
      { label: 'Kofein', value: '150mg' },
      { label: 'Šećer', value: '0g' },
      { label: 'Format', value: 'Single Shot' },
    ],
    variantType: 'ukus',
    variants: ['Energy', 'Berry Blast', 'Citrus'],
    badges: [{ label: 'Shot' }],
  },
  // ── KREATIN ────────────────────────────────────────────────────────────────
  {
    title: 'Kreatin Monohidrat',
    slug: 'kreatin-monohidrat',
    price: 1999,
    category: 'kreatin',
    description:
      'Kreatin Monohidrat je najisrtaženiji i najefikasniji oblik kreatina na tržištu.\n' +
      'Povećava snagu, eksplozivnost i mišićnu masu.\n' +
      'Mikronizovan za bolju rastvorljivost i apsorpciju — bez taloga.',
    highlights: [
      'Mikronizovani kreatin 200 mesh',
      '5g kreatin monohidrata po porciji',
      'Povećava snagu i mišićnu masu',
      'Bez aditiva i veštačkih boja',
    ],
    specifications: [
      { label: 'Kreatin monohidrat', value: '5g po porciji' },
      { label: 'Čistoća', value: '99.9%' },
      { label: 'Dostupna pakovanja', value: '300g, 500g, 1kg' },
    ],
    variantType: 'velicina',
    variants: ['300g', '500g', '1kg'],
    badges: [],
  },
  // ── APPAREL ────────────────────────────────────────────────────────────────
  {
    title: 'Basic Tee',
    slug: 'basic-tee',
    price: 2499,
    category: 'majice',
    description:
      'Basic Tee je udobna pamučna majica kratkih rukava.\n' +
      'Dostupna u nekoliko boja, savršena za gym i svakodnevni nošenje.',
    highlights: [
      '100% pamuk',
      'Relaxed fit',
      'Pranje na 40°C',
    ],
    specifications: [
      { label: 'Materijal', value: '100% pamuk' },
      { label: 'Fit', value: 'Relaxed' },
    ],
    variantType: 'boja',
    variants: ['Crna', 'Bela', 'Siva', 'Navy'],
    badges: [],
  },
  {
    title: 'Performance Shorts',
    slug: 'performance-shorts',
    price: 2999,
    salePrice: 2499,
    category: 'sorcevi-i-helanke',
    description:
      'Performance Shorts su izrađeni od lagane, prozračne tkanine.\n' +
      'Idealni za trening, trčanje i sport.',
    highlights: [
      'Lagana prozračna tkanina',
      'Bočni džepovi',
      'Elastični struk sa uzicom',
    ],
    specifications: [
      { label: 'Materijal', value: '88% poliester, 12% elastan' },
      { label: 'Dužina', value: 'Iznad kolena' },
    ],
    variantType: 'velicina',
    variants: ['S', 'M', 'L', 'XL', 'XXL'],
    badges: [{ label: 'Akcija' }],
  },
]

const PRODUCT_IMAGE_BY_CATEGORY: Record<string, string> = {
  proteini: 'tshirt-white.png',
  'pre-workout': 'hat-logo.png',
  kreatin: 'hat-logo.png',
  majice: 'tshirt-black.png',
  'sorcevi-i-helanke': 'tshirt-black.png',
}

function getImagePath(filename: string): string {
  return resolve(__dirname, '../endpoints/seed', filename)
}

function getMimeType(filename: string): string {
  const ext = extname(filename).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  return 'application/octet-stream'
}

function readLocalFile(filename: string): File {
  const path = getImagePath(filename)
  const data = readFileSync(path)

  return {
    name: filename,
    data,
    mimetype: getMimeType(filename),
    size: data.byteLength,
  }
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seedDemo({ payload, req }: { payload: Payload; req: PayloadRequest }) {
  payload.logger.info('=== Demo Seed Start ===')

  // ── 0. Cleanup ─────────────────────────────────────────────────────────────
  payload.logger.info('— Cleanup')
  const toClean = ['variants', 'variantOptions', 'variantTypes', 'products', 'categories', 'brands', 'media'] as const
  for (const col of toClean) {
    await payload.db.deleteMany({ collection: col, req, where: {} })
    payload.logger.info(`  cleared: ${col}`)
  }

  const mediaDir = resolve(__dirname, '../../public/media')
  if (existsSync(mediaDir)) {
    for (const entry of readdirSync(mediaDir)) {
      rmSync(join(mediaDir, entry), { recursive: true, force: true })
    }
    payload.logger.info(`  cleared media files: ${mediaDir}`)
  }

  // ── 1. Brand ───────────────────────────────────────────────────────────────
  payload.logger.info('— Brand')
  const brand = await payload.create({
    collection: 'brands',
    data: {
      title: 'Basic Supplements',
      slug: 'basic-supplements',
      description: 'Premium sportska suplementacija. GMP, HACCP i HALAL sertifikovana.',
    },
    req,
  })
  payload.logger.info(`  ✓ ${brand.title} (id: ${brand.id})`)

  // ── 2. Categories ──────────────────────────────────────────────────────────
  payload.logger.info('— Categories')
  const catIdBySlug = new Map<string, number>()
  const mediaIdByFilename = new Map<string, number>()

  const ensureMedia = async (filename: string, alt: string) => {
    const existingId = mediaIdByFilename.get(filename)
    if (existingId) return existingId

    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: readLocalFile(filename),
      req,
    })

    mediaIdByFilename.set(filename, media.id)
    return media.id
  }

  for (const root of CATEGORIES) {
    const rootImage = CATEGORY_IMAGE_BY_SLUG[root.slug]
    const rootDoc = await payload.create({
      collection: 'categories',
      data: {
        title: root.title,
        slug: root.slug,
        description: root.description,
        ...(rootImage ? { image: await ensureMedia(rootImage, root.title) } : {}),
      },
      req,
    })
    catIdBySlug.set(root.slug, rootDoc.id)
    payload.logger.info(`  [root] ${root.title} (id: ${rootDoc.id})`)

    for (const child of root.children ?? []) {
      const childDoc = await payload.create({
        collection: 'categories',
        data: { title: child.title, slug: child.slug, description: child.description, parent: rootDoc.id },
        req,
      })
      catIdBySlug.set(child.slug, childDoc.id)
      payload.logger.info(`    [sub] ${child.title} (id: ${childDoc.id})`)
    }
  }

  // ── 3. Variant types ───────────────────────────────────────────────────────
  payload.logger.info('— Variant types')
  const vtIdByName = new Map<string, number>()
  for (const vt of VARIANT_TYPES) {
    const doc = await payload.create({
      collection: 'variantTypes',
      data: { name: vt.name, label: vt.label },
      req,
    })
    vtIdByName.set(vt.name, doc.id)
    payload.logger.info(`  ✓ ${vt.label} (id: ${doc.id})`)
  }

  // ── 4. Variant options ─────────────────────────────────────────────────────
  payload.logger.info('— Variant options')
  // key: `${typeName}:${label}` → voId
  const voIdByKey = new Map<string, number>()

  for (const p of PRODUCTS) {
    if (!p.variantType || !p.variants.length) continue
    const vtId = vtIdByName.get(p.variantType)
    if (!vtId) continue
    for (const label of p.variants) {
      const key = `${p.variantType}:${label}`
      if (voIdByKey.has(key)) continue
      const vo = await payload.create({
        collection: 'variantOptions',
        data: { variantType: vtId, label, value: toSlug(label) },
        req,
      })
      voIdByKey.set(key, vo.id)
    }
  }
  payload.logger.info(`  created ${voIdByKey.size} options total`)

  // ── 5. Products ────────────────────────────────────────────────────────────
  payload.logger.info('— Products')

  for (const p of PRODUCTS) {
    const catId = catIdBySlug.get(p.category)
    const vtId = p.variantType ? vtIdByName.get(p.variantType) : undefined
    const imageName = PRODUCT_IMAGE_BY_CATEGORY[p.category]
    const gallery =
      imageName
        ? [
            {
              image: await ensureMedia(imageName, p.title),
            },
          ]
        : []

    const data: any = {
      title: p.title,
      slug: p.slug,
      price: p.price,
      _status: 'published',
      brand: brand.id,
      description: lexical(p.description),
      highlights: p.highlights.map((h) => ({ label: h })),
      specifications: p.specifications,
      badges: p.badges,
      enableVariants: p.variants.length > 0,
      visibility: 'catalog',
      inventory: p.variants.length > 0 ? 0 : 999,
      gallery,
    }

    if (p.salePrice) data.salePrice = p.salePrice
    if (catId) data.categories = [catId]
    if (vtId) data.variantTypes = [vtId]

    let product: any
    try {
      product = await payload.create({ collection: 'products', depth: 0, data, req })
      payload.logger.info(`  ✓ ${p.title} (id: ${product.id})`)
    } catch (err) {
      payload.logger.error(`  ✗ ${p.title}: ${err}`)
      continue
    }

    // Create variant records
    for (const label of p.variants) {
      const key = `${p.variantType}:${label}`
      const voId = voIdByKey.get(key)
      if (!voId) continue
      await payload
        .create({
          collection: 'variants',
          data: {
            product: product.id,
            options: [voId],
            inventory: 100,
            _status: 'published',
          } as any,
          req,
        })
        .catch((e: any) => payload.logger.warn(`    variant fail (${label}): ${e}`))
    }

    if (p.variants.length > 0) {
      payload.logger.info(`    → ${p.variants.length} variants [${p.variantType}]`)
    }
  }

  payload.logger.info('=== Demo Seed Complete ===')
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  req.context = { ...req.context, disableRevalidate: true }
  await seedDemo({ payload, req })
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
