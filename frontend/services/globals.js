import { payloadGlobal } from '@/lib/payload/client'
import { REVALIDATE } from '@/constants'

export async function getHeader() {
  try {
    return await payloadGlobal('header', {
      depth: 2,
      revalidate: REVALIDATE.globals,
      tags: ['header'],
    })
  } catch {
    return null
  }
}

export async function getHomeHero() {
  try {
    return await payloadGlobal('home-hero', {
      depth: 3,
      revalidate: REVALIDATE.globals,
      tags: ['home-hero'],
    })
  } catch {
    return null
  }
}

export async function getFooter() {
  try {
    return await payloadGlobal('footer', {
      depth: 2,
      revalidate: REVALIDATE.globals,
      tags: ['footer'],
    })
  } catch {
    return null
  }
}
