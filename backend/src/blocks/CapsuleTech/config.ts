import type { Block } from 'payload'

/**
 * Capsule Tech — 1:1 rekreacija seed.com "ViaCapSection" sekcije:
 * foto pozadina + frosted glass kartica preko nje; levo animirani label
 * (slovo po slovo), naslov, "note" kartica sa pill-om i brojačem (↑ 17x) i
 * disclaimer; desno 360° video proizvoda sa dve anotacije (gornja levo,
 * donja desno) povezane isprekidanim linijama.
 *
 * Izmereno direktno sa seed.com (computed styles):
 *   sekcija    padding 80px 32px, background-image cover
 *   kartica    max-w 1440, padding 80px, radius 32px, bg rgba(87,94,85,.35), backdrop-blur 37.5px
 *   levo       576px, desno 768px, gap 32px, desna kolona min-h 400px
 *   label      12px / 18px, uppercase, weight 300
 *   naslov     40px / 44px, weight 350, letter-spacing -0.4px, margin-top 24px
 *   note       inline-flex, padding 32px, radius 16px, border 1px rgba(255,255,255,.25), gap 24px
 *   note pill  12px, border 1.5px solid #FCFCF7, radius 1000px, padding 0 8px
 *   brojač     32px / 48px, weight 300; sufiks 16px; strelica 32px
 *   anotacije  tekst 200px + isprekidana linija 70px (1px dashed #FCFCF7), spacer 100px
 *   video      400×400, absolute, centriran u desnoj koloni, object-fit contain
 *   sve na ulazu u viewport: kartica translateY 60→0, kolone ±20→∓10,
 *   strelica 30px/0 → 0/1, brojač 0→N, slova labela stagger 50ms
 */
export const CapsuleTech: Block = {
  slug: 'capsuleTech',
  interfaceName: 'CapsuleTechBlock',
  labels: { singular: 'Capsule Technology', plural: 'Capsule Technology' },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Pozadinska slika',
    },
    {
      name: 'label',
      type: 'text',
      localized: true,
      label: 'Label (animira se slovo po slovo)',
      admin: { placeholder: 'npr. ViaCap® Technology' },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      label: 'Naslov',
    },
    {
      name: 'note',
      type: 'group',
      label: 'Note kartica',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pill',
              type: 'text',
              label: 'Pill',
              admin: { width: '50%', placeholder: 'npr. PRO WHEY' },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              label: 'Tekst',
              admin: { width: '50%', placeholder: 'npr. Povećava sintezu proteina°' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'metric',
              type: 'text',
              label: 'Broj',
              admin: { width: '33%', placeholder: 'npr. 17' },
            },
            {
              name: 'metricSuffix',
              type: 'text',
              label: 'Sufiks',
              admin: { width: '33%', placeholder: 'npr. x' },
            },
            {
              name: 'arrow',
              type: 'select',
              label: 'Strelica',
              defaultValue: 'up',
              options: [
                { label: 'Gore ↑', value: 'up' },
                { label: 'Dole ↓', value: 'down' },
                { label: 'Bez strelice', value: 'none' },
              ],
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'text',
      localized: true,
      label: 'Disclaimer (mali tekst pod note karticom)',
    },
    {
      name: 'media',
      type: 'group',
      label: 'Vizual (desna kolona)',
      admin: {
        description:
          'Video ima prioritet nad slikom. Ako nemaš video fajl, upiši direktan URL ili koristi sliku.',
      },
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          label: 'Video fajl (mp4/webm)',
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Video URL',
          admin: { placeholder: 'https://.../capsule-360.mp4' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Slika (fallback)',
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Anotacije',
      maxRows: 2,
      labels: { singular: 'Anotacija', plural: 'Anotacije' },
      admin: {
        description: 'Prva se crta levo-gore, druga desno-dole — kao na originalu.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
          admin: { placeholder: 'npr. SPOLJNI SLOJ' },
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
  ],
}
