/**
 * Translates products_scraped.json (Serbian → English)
 * Outputs: products_scraped_en.json
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... pnpm tsx src/scripts/translate-products.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY environment variable')
  process.exit(1)
}

interface ScrapedVariant {
  name: string
  type: string
  inStock: boolean
}

interface ScrapedProduct {
  title: string
  slug: string
  url: string
  price: number
  salePrice?: number | null
  categoryPath: string[]
  images: string[]
  description: string
  variants: ScrapedVariant[]
  highlights: string[]
  specifications: { label: string; value: string }[]
  [key: string]: unknown
}

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error ${res.status}: ${err}`)
  }

  const data = (await res.json()) as { content: { type: string; text: string }[] }
  return data.content[0].text
}

async function translateProduct(p: ScrapedProduct): Promise<Partial<ScrapedProduct>> {
  const toTranslate: Record<string, unknown> = {}

  if (p.description) toTranslate.description = p.description
  if (p.highlights?.length) toTranslate.highlights = p.highlights
  if (p.specifications?.length) toTranslate.specifications = p.specifications

  if (Object.keys(toTranslate).length === 0) return {}

  const prompt = `Translate the following supplement product content from Serbian to English.
Keep product/brand names, ingredient names, dosages, numbers, and registration numbers unchanged.
Remove references to "Ministarstvo Zdravlja Republike Srbije" registration numbers entirely.
Return ONLY valid JSON with the same structure as the input.

Input:
${JSON.stringify(toTranslate, null, 2)}`

  const raw = await callClaude(prompt)

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON in response: ${raw.substring(0, 200)}`)

  return JSON.parse(jsonMatch[0]) as Partial<ScrapedProduct>
}

async function main() {
  const inputPath = resolve(__dirname, '../../products_scraped.json')
  const outputPath = resolve(__dirname, '../../products_scraped_en.json')

  // Load progress if exists (resume on crash)
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
    const p = products[i]
    console.log(`[${i + 1}/${products.length}] ${p.title}`)

    try {
      const patch = await translateProduct(p)
      translated.push({ ...p, ...patch })
    } catch (err) {
      console.error(`  ERROR: ${err} — keeping original`)
      translated.push(p)
    }

    // Save progress after each product
    writeFileSync(progressPath, JSON.stringify(translated, null, 2))

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300))
  }

  writeFileSync(outputPath, JSON.stringify(translated, null, 2))
  console.log(`\nDone! Saved to: ${outputPath}`)

  // Clean up progress file
  if (existsSync(progressPath)) {
    const { rmSync } = await import('fs')
    rmSync(progressPath)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
