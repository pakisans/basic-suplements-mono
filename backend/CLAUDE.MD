# Payload Ecommerce — Agent Brief

Ovo je WooCommerce-like ecommerce starter template baziran na Payload CMS 3.x + Next.js 16 + PostgreSQL.

## Kreiranje svežeg projekta

**UVEK koristiti ecommerce template — ne blank:**

```bash
npx create-payload-app@latest -t ecommerce
```

Bez `-t ecommerce` nema: `@payloadcms/plugin-ecommerce`, Stripe adaptera, `CollectionOverride` patterna, Orders/Cart/Checkout frontenda, account stranica.
Naš kod direktno zavisi od svega toga — bez ecommerce templatea ne kompajlira.

## Stack

- **Payload**: 3.80.0
- **Next.js**: 16.2.1
- **DB adapter**: `@payloadcms/db-postgres` 3.80.0
- **Plugins**: `@payloadcms/plugin-ecommerce`, `@payloadcms/plugin-seo`, `@payloadcms/plugin-form-builder`
- **Payments**: Stripe via `stripeAdapter`
- **Package manager**: pnpm

## Šta je base template, šta je custom

Polazna tačka je oficijalni `@payloadcms/plugin-ecommerce` template.
Sve što je ispod je **custom** — treba kreirati/modifikovati na svežem projektu.

---

## Arhitekturne odluke (VAŽNO — ne menjaj bez razloga)

1. **Lokalizacija**: `sr` (default) + `en`. Polja sa tekstom imaju `localized: true`. Cene, slug, kodovi kupona su NISU lokalizovani.
2. **Cene**: Integers u celim dinarima (RSD). Nema decimala. 1999 = 1.999 RSD. `priceInUSD` od ecommerce plugina ostaje netaknut (Stripe).
3. **Flexible content**: ACF Pro pattern — `blocks` field via `flexibleContent()` factory iz `src/fields/flexibleContent.ts`. Koristiti svuda.
4. **Admin grupe**: `Katalog` (products, categories, tags, brands), `Prodavnica` (coupons, orders), `Sadržaj` (pages, media, forms), `Podešavanja` (globals).
5. **Products**: `CollectionOverride` pattern via ecommerce plugin — ne menjati u standalone kolekciju.

---

## Svi custom fajlovi — šta kreirati

### `src/fields/`

#### `src/fields/price.ts` — RSD pricing fields

Reusable fields array: `price` (number, required), `salePrice` (number), `saleStartDate` (date, condition: salePrice exists), `saleEndDate` (date, condition: salePrice exists). Sve u row parovima. Cene su integer dinari.

#### `src/fields/seo.ts` — Manual SEO group

`seoGroup: Field` — group sa poljima: `seo.title` (text, localized), `seo.description` (textarea, localized), `seo.image` (upload, media). Koristi se na kolekcijama koje NISU pokrivene plugin-seo (Categories, Brands, Tags).

#### `src/fields/flexibleContent.ts` — ACF Flexible Content factory

Exportuje:

- `allContentBlocks: Block[]` — svi blokovi uključujući Code, Archive, FormBlock
- `defaultContentBlocks: Block[]` — bez Code/Archive/Form (za products, categories, brands)
- `flexibleContent(options?): Field` — factory funkcija

Options: `{ name, label, blocks, maxRows, description, initCollapsed }`. Defaults: name=`content`, label=`Sadržaj`, blocks=`defaultContentBlocks`, maxRows=20, initCollapsed=true.

Importuje blokove: Content, CallToAction, Banner, Quote, FAQ, MediaBlock, Video, Carousel, ThreeItemGrid, Stats, Spacer, Code, Archive, FormBlock.

---

### `src/blocks/` — novi blokovi (dodati pored postojećih)

Postojeći (base template, ne diraj): `Banner`, `CallToAction`, `Content`, `MediaBlock`, `Carousel`, `ThreeItemGrid`, `ArchiveBlock`, `Code`, `Form`.

**Kreirati:**

#### `src/blocks/Quote/config.ts`

Fields: `text` (textarea, localized, required), `author` (text, localized), `role` (text, localized), `avatar` (upload media), `rating` (select: 5/4/3).

#### `src/blocks/FAQ/config.ts`

Fields: `heading` (text, localized), `items` (array): `question` (text, localized, required), `answer` (richText, localized, required — minimal lexical: Bold, Italic, List, Link).

#### `src/blocks/Stats/config.ts`

Fields: `heading` (text, localized), `items` (array, max 6): row sa `value` (text, 33%, required) + `label` (text, localized, 67%, required).

#### `src/blocks/Video/config.ts`

Fields: `platform` (select: youtube/vimeo/direct, default youtube), `url` (text, required), `caption` (text, localized), `thumbnail` (upload media), `autoplay` (checkbox, default false).

#### `src/blocks/Spacer/config.ts`

Fields: `size` (select: xs/sm/md/lg/xl, default md), `showDivider` (checkbox, default false).

**Footer-specific blokovi** (koriste se samo u Footer global):

#### `src/blocks/FooterBrand/config.ts`

Fields: `logo` (upload media), `tagline` (text, localized), `description` (textarea, localized).

#### `src/blocks/FooterColumn/config.ts`

Fields: `title` (text, localized, required), `links` (array, max 12) sa `link` field helper.

#### `src/blocks/FooterText/config.ts`

Fields: `title` (text, localized), `content` (richText, localized, required — minimal lexical: Bold, Italic, Link).

#### `src/blocks/FooterContact/config.ts`

Fields: `title` (text, localized), `phone` (text), `email` (email), `address` (text), `workingHours` (text, localized), `mapLink` (text).

#### `src/blocks/FooterSocial/config.ts`

Fields: `title` (text, localized), `profiles` (array, max 10): row sa `platform` (select: instagram/facebook/tiktok/youtube/twitter/linkedin/pinterest/whatsapp/viber) + `url` (text, required).

#### `src/blocks/FooterNewsletter/config.ts`

Fields: `heading` (text, localized, required), `description` (textarea, localized), `buttonLabel` (text, localized, default "Prijavi se"), `privacyNote` (text, localized).

---

### `src/collections/` — modifikovati/kreirati

#### `src/collections/Categories.ts` — ZAMENITI (base ima prazan)

- slug: `categories`, group: `Katalog`
- Fields: `title` (text, localized, required), `slugField()`, `parent` (relationship self, sidebar, filterOptions exclude self)
- Tabs: `Opšte` (description textarea localized, image upload), `Sadržaj stranice` (`flexibleContent()`), `SEO` (`seoGroup`)

#### `src/collections/Tags.ts` — KREIRATI

- slug: `tags`, group: `Katalog`, useAsTitle: `title`
- Fields: `title` (text, localized, required), `slugField()`, `description` (textarea, localized)
- Access: adminOnly za create/update/delete, public read

#### `src/collections/Brands.ts` — KREIRATI

- slug: `brands`, group: `Katalog`, useAsTitle: `title`
- Fields: `title` (text, localized, required), `slugField()`, `logo` (upload media), `description` (textarea, localized)
- Tabs: `O brendu` (`flexibleContent()`), `SEO` (`seoGroup`)

#### `src/collections/Coupons.ts` — KREIRATI

- slug: `coupons`, group: `Prodavnica`, useAsTitle: `code`, access: adminOnly sve
- Fields:
  - Row: `code` (text, required, unique, index:true) + `active` (checkbox, default true)
  - Row: `type` (select: percentage/fixed, required, default percentage) + `value` (number, required, min 0)
  - `minimumOrderAmount` (number, min 0)
  - Collapsible "Vremensko ograničenje": row `startDate` + `endDate` (date, dayAndTime)
  - Collapsible "Ograničenje korišćenja": row `usageLimit` (number) + `usageCount` (number, readOnly, default 0)
  - Collapsible "Primeniti na": `products` (relationship products, hasMany), `categories` (relationship categories, hasMany)

#### `src/collections/Products/index.ts` — ZAMENITI (base ima stub)

`CollectionOverride` pattern. Import: `priceFields`, `flexibleContent`, seo plugin fields, lexical features.

Admin: group `Katalog`, defaultColumns `['title', 'price', '_status', 'categories']`.

defaultPopulate: title, slug, price, salePrice, saleStartDate, saleEndDate, badges, brand, categories, tags, gallery, meta, variantOptions, variants, enableVariants, priceInUSD, inventory.

Fields:

- `title` (text, localized, required) — top level, izvan tabova
- Tabs:
  - **Sadržaj**: `description` (richText, localized, fullToolbar lexical), `gallery` (array: image upload + variantOption relationship sa filterOptions), `flexibleContent({name:'layout', ...})`
  - **Detalji**: `badges` (select hasMany: new/sale/bestseller/featured/limited/preorder), `highlights` (array, localized: text field), `specifications` (array, localized: row label+value)
  - **Cene (RSD)**: spread `priceFields`
  - **Detalji proizvoda**: `...defaultCollection.fields`, `relatedProducts` (relationship products, hasMany, filterOptions exclude self)
  - **SEO**: OverviewField, MetaTitleField, MetaImageField, MetaDescriptionField, PreviewField
  - **Veze**: `brand` (relationship brands), `tags` (relationship tags, hasMany), `upsell` (relationship products, hasMany, filterOptions exclude self), `crossSell` (relationship products, hasMany, filterOptions exclude self)
- Sidebar: `categories` (relationship categories, hasMany, sortOptions title), `visibility` (select: visible/hidden/search_only, default visible)
- `slugField()` — top level

---

### `src/globals/` — modifikovati/kreirati

#### `src/globals/Header.ts` — ZAMENITI

Fields:

- `navItems` (array, max 8): `link({appearances:false})` + `subItems` (array, max 8, fields: link)
- `promoBanner` (group): `enabled` (checkbox), `text` (text, localized, condition enabled), `link` (text, condition enabled), `image` (upload, condition enabled)

#### `src/globals/Footer.ts` — ZAMENITI

Fields:

- `sections` (blocks, max 6): FooterBrand, FooterColumn, FooterText, FooterContact, FooterSocial, FooterNewsletter
- `bottomBar` (group): `copyright` (text, localized), `legalLinks` (array, max 6: `label` text localized + `url` text)

#### `src/globals/SiteSettings.ts` — KREIRATI

slug: `site-settings`, group: `Podešavanja`
Fields: `siteName` (text, required), `siteTagline` (text, localized), `siteDescription` (textarea, localized), `logo` (upload), `favicon` (upload), `defaultOgImage` (upload), `defaultSeo` (group: title localized, titleSuffix, description localized), `social` (group: instagram/facebook/tiktok/youtube/twitter text fields)

#### `src/globals/AnnouncementBar.ts` — KREIRATI

slug: `announcement-bar`, group: `Podešavanja`
Fields: `enabled` (checkbox, default false), `text` (text, localized, condition enabled), `link` (text, condition enabled), `backgroundColor` (text, default #000000), `textColor` (text, default #ffffff)

#### `src/globals/StoreSettings.ts` — KREIRATI

slug: `store-settings`, group: `Podešavanja`
Fields:

- `currency` (group): `code` (select: RSD/EUR/USD, default RSD, required), `symbol` (text, default RSD), `symbolPosition` (select: before/after, default after), `thousandsSeparator` (select: ./,/space, default .)
- `shipping` (group): `defaultCost` (number, default 0), `freeShippingThreshold` (number)
- `tax` (group): `enabled` (checkbox), `rate` (number, default 20, condition enabled), `includedInPrice` (checkbox, default true, condition enabled), `taxIdLabel` (text, default PIB, condition enabled)
- `storeAddress` (group): `companyName`, `street`, `city`, `postalCode`, `country` (default Srbija)

---

### `src/plugins/index.ts` — MODIFIKOVATI

- Ukloniti typed `GenerateTitle<Product | Page>` — koristiti `GenerateTitle` bez generics ili sa `any`
- `generateURL` treba biti collection-aware:
  ```
  products → /products/${slug}
  categories → /shop?category=${slug}
  brands → /brands/${slug}
  default → /${slug}
  ```
- Orders collectionOverride: dodati `group: 'Prodavnica'` i `accessToken` field (text, unique, index, readOnly, beforeValidate hook: crypto.randomUUID() on create)
- formBuilderPlugin: group `Sadržaj` za forms i submissions
- `generateURL` mora pokrivati: products → `/products/${slug}`, categories → `/shop?category=${slug}`, brands → `/brands/${slug}`, posts → `/blog/${slug}`, post-categories → `/blog/category/${slug}`

### `src/utilities/generatePreviewPath.ts` — MODIFIKOVATI

Dodati `posts: '/blog'` u `collectionPrefixMap`.

### Blog collections — KREIRATI

#### `src/collections/PostCategories.ts`

slug: `post-categories`, group: `Blog`, useAsTitle: `title`. Odvojeno od product kategorija.
Fields: `title` (text, localized, required), `slugField()`, `parent` (relationship self, sidebar, filterOptions exclude self).
Tabs: `Opšte` (description textarea localized, image upload), `SEO` (seoGroup).

#### `src/collections/Posts/hooks/revalidatePost.ts`

Isti pattern kao `revalidatePage`. Paths: `/blog/${slug}`. revalidateTag: `posts-sitemap`.
Exportuje: `revalidatePost` (afterChange) i `revalidatePostDelete` (afterDelete).

#### `src/collections/Posts/index.ts`

slug: `posts`, group: `Blog`, useAsTitle: `title`.
access: adminOnly create/delete/update, `adminOrPublishedStatus` read.
Admin: livePreview i preview via `generatePreviewPath` sa `collection: 'posts'`.
versions: drafts sa autosave (interval 375ms), maxPerDoc 50.
hooks: afterChange `revalidatePost`, afterDelete `revalidatePostDelete`.

Fields (top level): `title` (text, localized, required).

Sidebar: `author` (relationship users), `publishedAt` (date, dayAndTime, beforeChange hook: set to now on publish if empty), `readTime` (number, min).

Tabs:

- **Sadržaj**: `excerpt` (textarea, localized, ~160 chars), `content` (richText, localized, required — fullToolbar lexical: h2/h3/h4, Horizontal Rule), `flexibleContent({name:'layout', ...})`
- **Mediji**: `featuredImage` (upload media), `featuredImageCaption` (text, localized)
- **SEO**: OverviewField, MetaTitleField, MetaImageField, MetaDescriptionField, PreviewField
- **Veze**: `categories` (relationship post-categories, hasMany), `tags` (relationship tags, hasMany), `relatedPosts` (relationship posts, hasMany, filterOptions exclude self)

`slugField()` — top level.

### `src/payload.config.ts` — MODIFIKOVATI

Dodati:

```ts
// Collections
collections: [Users, Pages, Posts, PostCategories, Categories, Tags, Brands, Coupons, Media]

// Globals
globals: [Header, Footer, SiteSettings, AnnouncementBar, StoreSettings]

// Localization
localization: {
  locales: [
    { label: 'Srpski', code: 'sr' },
    { label: 'English', code: 'en' },
  ],
  defaultLocale: 'sr',
  fallback: true,
}
```

---

## Setup komande (svež projekat)

```bash
# 1. Instaliraj zavisnosti
pnpm install

# 2. Kopiraj env
cp .env.example .env
# Popuni: DATABASE_URL, PAYLOAD_SECRET, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOKS_SIGNING_SECRET, NEXT_PUBLIC_SERVER_URL

# 3. Regeneriši TypeScript tipove
pnpm generate:types

# 4a. Svež projekat bez podataka — najbrže:
pnpm payload migrate:fresh

# 4b. Ili ako imaš postojeće migracije:
pnpm payload migrate:create
pnpm payload migrate

# 5. Pokreni dev server
pnpm dev
```

---

## Česte greške i rešenja

**TypeScript greška na `CollectionOverride`** — import mora biti `from '@payloadcms/plugin-ecommerce/types'`, ne iz `payload`.

**`slugField()` ne generiše slug** — field `title` mora biti popunjen. Slug se auto-generiše iz `title` polja.

**Lokalizovana polja prazna na `en`** — normalno ako `fallback: true` — vraća srpski. Popuni u adminu klikom na language switcher.

**`defaultCollection.fields` undefined** — u `ProductsCollection` CollectionOverride, `defaultCollection` dolazi iz plugina i mora biti spread-ovan tek u tabs, ne na top levelu fields array.

**Blokovi se ne pojavljuju** — proveri da su importovani u `flexibleContent.ts` i dodati u odgovarajući set (`defaultContentBlocks` ili `allContentBlocks`).

**Footer blokovi** — `FooterBrand`, `FooterColumn` itd. se importuju direktno u `Footer.ts`, nisu deo `flexibleContent` factory-a.
