import type { Block } from 'payload'

/**
 * Feature Showcase — an editorial feature section: badge + heading + body + CTA
 * on one side, a large hero image plus a row of smaller images on the other.
 * All images are uploads, fully editable in the CMS.
 */
export const FeatureShowcase: Block = {
  slug: 'featureShowcase',
  interfaceName: 'FeatureShowcaseBlock',
  labels: { singular: 'Feature Showcase', plural: 'Feature Showcases' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: { width: '50%', placeholder: 'e.g. Bundle + Save 25%' },
        },
        {
          name: 'imageSide',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Images right', value: 'right' },
            { label: 'Images left', value: 'left' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Button',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'Shop now' },
            },
            {
              name: 'url',
              type: 'text',
              admin: { width: '50%', placeholder: '/products' },
            },
          ],
        },
      ],
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main image',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Small images',
      maxRows: 4,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
