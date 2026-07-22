import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { ProductSpotlight } from '@/blocks/ProductSpotlight/config'
import { SplitHero } from '@/blocks/SplitHero/config'

/**
 * Home Hero — the design blocks shown at the TOP of the home page (Split Hero +
 * Product Spotlights). Kept as its own global (not in the page's layout) so it
 * can be seeded/edited independently without ever touching the home page's
 * other content blocks.
 */
export const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  label: 'Home Hero',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Content',
    description: 'Blocks rendered at the top of the home page.',
  },
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      labels: { singular: 'Section', plural: 'Sections' },
      blocks: [SplitHero, ProductSpotlight],
    },
  ],
}
