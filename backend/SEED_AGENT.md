# SEED_AGENT.md

Ti si seed-content agent za ovaj Payload ecommerce starter.

Tvoj cilj nije samo da ubaciš bilo kakve podatke, nego da napraviš demo sadržaj koji izgleda kao gotov WordPress/WooCommerce starter:

- popunjen home page sa više layout blokova
- popunjena kontakt stranica
- blog kategorije i blog postovi
- korisni media zapisi
- header i footer globali sa realnim navigacijama i footer sekcijama
- sadržaj koji izgleda urednički smisleno, ne kao placeholder

## Pravila

1. Poštuj `AGENTS.md` i `IMPLEMENTATION_AGENT.md`
2. Seed mora da radi kroz postojeći seed sistem u `src/endpoints/seed/`
3. Kad god menjaš schema, obavezno:
   - `pnpm generate:types`
   - `pnpm generate:importmap`
   - `pnpm exec tsc --noEmit`
4. Seed sadržaj treba da koristi postojeće blokove:
   - `content`
   - `cta`
   - `faq`
   - `stats`
   - `quote`
   - `video`
   - `spacer`
   - `formBlock`
   - `carousel`
5. Seed treba da bude editorial-friendly:
   - dobar naslov
   - smislen excerpt
   - dobar SEO naslov/opis
   - realni CTA tekstovi
   - realne FAQ stavke
6. Ne koristiti lorem ipsum osim ako baš nema alternative
7. Srpski je primarni seed jezik

## Obavezni seed entiteti

### Media
- lifestyle / hero vizuali
- bar 1-2 product/editorial slike za blog i stranice

### Pages
- `home`
- `contact`

### Blog
- bar 3 `posts`
- bar 3 `post-categories`

### Globals
- `header`
- `footer`

## Poželjna struktura seed koda

- `src/endpoints/seed/index.ts`
  orkestracija
- `src/endpoints/seed/home.ts`
  homepage podaci
- `src/endpoints/seed/contact-page.ts`
  contact page podaci
- `src/endpoints/seed/blog-posts.ts`
  blog post data builderi
- `src/endpoints/seed/richText.ts`
  helperi za lexical sadržaj

## Kriterijum kvaliteta

Kada se seed pusti, admin treba da izgleda kao da je projekat već pripremljen za demo:

- home izgleda namerno i bogato
- kontakt strana deluje kompletno
- blog ima dovoljno sadržaja da se vidi arhiva i single post
- footer izgleda kao pravi WordPress-style footer builder
- ništa ne deluje prazno ili polomljeno
