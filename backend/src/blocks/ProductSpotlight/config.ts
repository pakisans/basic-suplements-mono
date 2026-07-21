import type { Block } from 'payload'

/**
 * Product Spotlight — a single-product highlight section (image on one side,
 * short editorial copy + optional stat + CTA on the other). Used on the home
 * page to feature individual products.
 */
export const ProductSpotlight: Block = {
  slug: 'productSpotlight',
  interfaceName: 'ProductSpotlightBlock',
  labels: { singular: 'Product Spotlight', plural: 'Product Spotlights' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: { width: '50%', placeholder: 'e.g. Bestseller' },
        },
        {
          name: 'imageSide',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Image right', value: 'right' },
            { label: 'Image left', value: 'left' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: { description: 'Image, name and price are pulled from this product.' },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short blurb shown next to the product.' },
    },
    {
      name: 'stat',
      type: 'group',
      label: 'Highlight (optional)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              admin: { width: '40%', placeholder: 'e.g. 22g' },
            },
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '60%', placeholder: 'e.g. protein per serving' },
            },
          ],
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      admin: { placeholder: 'Shop now' },
    },
  ],
}
