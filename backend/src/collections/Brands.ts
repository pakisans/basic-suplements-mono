import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { flexibleContent } from '@/fields/flexibleContent'
import { seoGroup } from '@/fields/seo'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Ecommerce',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      localized: false,
      position: undefined,
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            flexibleContent({
              description: 'Optional landing page content for this brand.',
            }),
          ],
        },
        {
          label: 'SEO',
          fields: [seoGroup],
        },
      ],
    },
  ],
}
