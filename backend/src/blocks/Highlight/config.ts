import type { Block } from 'payload'

/**
 * Highlight — 1:1 rekreacija seed.com "HighlightSection" sekcije:
 * tamni panel sa zaobljenim gornjim uglovima, sa jedne strane pill badge +
 * naslov + tekst + CTA, sa druge strane grid od jedne velike i tri male slike.
 *
 * Geometrija je izmerena direktno sa seed.com (computed styles), a paleta je
 * NAŠA (crna tema) — belo pill dugme sa crnim tekstom, tamne površine:
 *   section   radius 32px 32px 0 0, padding 80px 32px
 *   grid      12 kolona, gap 32px — tekst span 6 (align-self: center), slike span 6
 *   badge     pill, radius 1000px, 12px/500
 *   naslov    40px / 44px, weight 350, letter-spacing -0.4px
 *   body      16px / 20.8px
 *   CTA       pill, radius 1000px, padding 16px 24px
 *   slike     grid 6 kolona, gap 16px; velika 1/-1 (704x396), male span 2 (224x196), radius 16px
 */
export const Highlight: Block = {
  slug: 'highlight',
  interfaceName: 'HighlightBlock',
  labels: { singular: 'Highlight', plural: 'Highlights' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'badge',
          type: 'text',
          localized: true,
          label: 'Badge',
          admin: { width: '50%', placeholder: 'npr. Paket + Uštedi 25%' },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'right',
          label: 'Pozicija slika',
          options: [
            { label: 'Slike desno', value: 'right' },
            { label: 'Slike levo', value: 'left' },
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
      label: 'Naslov',
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      label: 'Tekst',
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Dugme',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'Kupi paket' },
            },
            {
              name: 'url',
              type: 'text',
              admin: { width: '50%', placeholder: '/proizvodi' },
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
      label: 'Velika slika',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Male slike',
      maxRows: 3,
      labels: { singular: 'Slika', plural: 'Slike' },
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
