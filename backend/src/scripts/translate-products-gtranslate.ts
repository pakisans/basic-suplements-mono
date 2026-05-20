/**
 * Translates products_scraped.json (Serbian → English) using Google Translate free endpoint.
 * Outputs: products_scraped_en.json
 *
 * Usage:
 *   pnpm tsx src/scripts/translate-products-gtranslate.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface ScrapedProduct {
  title: string
  slug: string
  url: string
  price: number
  salePrice?: number | null
  categoryPath: string[]
  images: string[]
  description: string
  variants: { name: string; type: string; inStock: boolean }[]
  highlights: string[]
  specifications: { label: string; value: string }[]
  [key: string]: unknown
}

async function translateText(text: string): Promise<string> {
  if (!text || !text.trim()) return text

  // Google Translate free endpoint - 5000 char limit per request
  const chunks = splitIntoChunks(text, 4500)
  const translated: string[] = []

  for (const chunk of chunks) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=sr&tl=en&dt=t&q=${encodeURIComponent(chunk)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Translate error ${res.status}`)
    const data = (await res.json()) as unknown[][]
    const segments = data[0] as unknown[][]
    const result = segments.map((s) => (s as unknown[])[0] as string).join('')
    translated.push(result)
    await sleep(100)
  }

  return translated.join(' ')
}

function splitIntoChunks(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text]
  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let current = ''
  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > maxLen) {
      if (current) chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? current + ' ' + sentence : sentence
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// Remove Serbian Ministry of Health registration lines
function cleanText(text: string): string {
  return text
    .replace(/Broj i datum upisa u bazu Ministarstva Zdravlja[^.]*\./gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

async function main() {
  const inputPath = resolve(__dirname, '../../products_scraped.json')
  const outputPath = resolve(__dirname, '../../products_scraped_en.json')
  const progressPath = resolve(__dirname, '../../products_scraped_en.progress.json')

  const products: ScrapedProduct[] = JSON.parse(readFileSync(inputPath, 'utf-8'))

  let translated: ScrapedProduct[] = []
  let startIndex = 0

  if (existsSync(progressPath)) {
    translated = JSON.parse(readFileSync(progressPath, 'utf-8'))
    startIndex = translated.length
    console.log(`Resuming from product ${startIndex}/${products.length}`)
  }

  for (let i = startIndex; i < products.length; i++) {
    const p = { ...products[i] }
    console.log(`[${i + 1}/${products.length}] ${p.title}`)

    try {
      if (p.description) {
        p.description = await translateText(cleanText(p.description))
        await sleep(200)
      }

      if (p.highlights?.length) {
        const translatedHighlights: string[] = []
        for (const h of p.highlights) {
          translatedHighlights.push(await translateText(h))
          await sleep(100)
        }
        p.highlights = translatedHighlights
      }

      if (p.specifications?.length) {
        const translatedSpecs: { label: string; value: string }[] = []
        for (const s of p.specifications) {
          const label = await translateText(s.label)
          await sleep(50)
          const value = await translateText(s.value)
          await sleep(50)
          translatedSpecs.push({ label, value })
        }
        p.specifications = translatedSpecs
      }
    } catch (err) {
      console.error(`  ERROR on product ${i}: ${err} — keeping original`)
    }

    translated.push(p)
    writeFileSync(progressPath, JSON.stringify(translated, null, 2))
    console.log(`  Done`)

    await sleep(300)
  }

  writeFileSync(outputPath, JSON.stringify(translated, null, 2))
  console.log(`\nSaved: ${outputPath}`)

  // Clean up progress file
  const { rmSync } = await import('fs')
  if (existsSync(progressPath)) rmSync(progressPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
