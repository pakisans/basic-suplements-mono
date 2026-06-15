import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { flexibleContent } from '@/fields/flexibleContent'
import { seoGroup } from '@/fields/seo'
import { revalidateCategories, revalidateCategoriesDelete } from '@/hooks/revalidateShop'

export const Categories: CollectionConfig = {
  slug: 'categories',
  hooks: {
    afterChange: [revalidateCategories],
    afterDelete: [revalidateCategoriesDelete],
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  // Categories are ordered by `sortOrder` everywhere (admin list + storefront).
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'sortOrder', 'slug', 'parent', 'updatedAt'],
    components: {
      // Drag-and-drop reorder panel above the Categories list (saves instantly).
      beforeListTable: ['@/components/admin/CategoryReorder#CategoryReorder'],
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        step: 1,
        description:
          'Display order — lower numbers appear first (among categories with the same parent). Reorder by editing this number.',
      },
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
              name: 'parent',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            flexibleContent({
              description: 'Optional landing page content for this category.',
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
