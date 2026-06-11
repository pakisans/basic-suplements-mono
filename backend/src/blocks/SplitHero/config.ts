import type { Block } from 'payload'

/**
 * Split hero — two side-by-side image panels, each with its own link and label.
 * Used as the first block on the home page (editorial replacement for the
 * auto-generated category hero).
 */
export const SplitHero: Block = {
  slug: 'splitHero',
  interfaceName: 'SplitHeroBlock',
  labels: { singular: 'Split Hero', plural: 'Split Heroes' },
  fields: [
    {
      name: 'panels',
      type: 'array',
      label: 'Panels',
      minRows: 2,
      maxRows: 2,
      labels: { singular: 'Panel', plural: 'Panels' },
      admin: {
        description: 'Two image panels shown side by side. Each links somewhere.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'e.g. SHOP' },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
              admin: { width: '50%', placeholder: 'e.g. SUPPLEMENTS' },
            },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { placeholder: '/products' },
        },
      ],
    },
  ],
}
