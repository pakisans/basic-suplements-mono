import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { FooterBrand } from '@/blocks/FooterBrand/config'
import { FooterColumn } from '@/blocks/FooterColumn/config'
import { FooterContact } from '@/blocks/FooterContact/config'
import { FooterNewsletter } from '@/blocks/FooterNewsletter/config'
import { FooterSocial } from '@/blocks/FooterSocial/config'
import { FooterText } from '@/blocks/FooterText/config'
import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Globals',
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [link({ appearances: false })],
      maxRows: 6,
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        FooterBrand,
        FooterColumn,
        FooterText,
        FooterContact,
        FooterSocial,
        FooterNewsletter,
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'bottomBar',
      type: 'group',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          localized: true,
        },
        {
          name: 'legalLinks',
          type: 'array',
          maxRows: 6,
          fields: [link({ appearances: false })],
        },
      ],
    },
  ],
}
