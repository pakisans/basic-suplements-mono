import type { Block } from 'payload'

/**
 * Science Intro — 1:1 rekreacija seed.com "MicrobioSection" (Microbiome 101 intro):
 * tamna sekcija, 12-kolonski grid; levo brand oznaka u uglastim zagradama, veliki
 * naslov, tekst i pill dugme sa play krugom, dole levo "SCIENCE / …" oznaka;
 * desno veliki kvadratni vizual (video koji se sam pušta ili animirana slika).
 *
 * Geometrija je izmerena direktno sa seed.com (computed styles), a paleta je
 * NAŠA (crna tema) — belo pill dugme sa crnim play krugom:
 *   sekcija   padding 0 32px, min-height 760px
 *   grid      12 kolona, gap 32px, align-items center, max-w 1440
 *   brand     col 1/span 2, 20px / 18px, weight 350, letter-spacing -0.6px
 *   tekst     col 1/span 5 — naslov 48px / 52.8px, weight 350, -0.72px
 *   body      16px / 20.8px, margin-top 32px
 *   dugme     pill, padding 5px 5px 5px 34px, gap 18px, play krug 38px
 *   footer    col 1/span 3, align-self end — label 16px uppercase (ls 0.24px, 400)
 *             + naslov 16px weight 500
 *   vizual    col 7/span 6, kvadrat (1/1), radius 32px,
 *             video autoplay + loop + muted, object-fit cover
 */
export const ScienceIntro: Block = {
  slug: 'scienceIntro',
  interfaceName: 'ScienceIntroBlock',
  labels: { singular: 'Science Intro', plural: 'Science Intros' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'brandMark',
          type: 'text',
          localized: true,
          label: 'Brand oznaka',
          admin: { width: '50%', placeholder: 'npr. Basic Supplements' },
        },
        {
          name: 'mediaSide',
          type: 'select',
          defaultValue: 'right',
          label: 'Pozicija vizuala',
          options: [
            { label: 'Vizual desno', value: 'right' },
            { label: 'Vizual levo', value: 'left' },
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
      admin: {
        description:
          'Ako URL ostane prazan a postoji video, dugme otvara video u lightboxu (kao na originalu).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'Otkrij' },
            },
            {
              name: 'url',
              type: 'text',
              admin: { width: '50%', placeholder: '/blog/protein-101' },
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Oznaka u dnu',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'npr. NAUKA /' },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'npr. Protein 101' },
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      label: 'Vizual (kvadrat)',
      admin: {
        description:
          'Video ima prioritet nad slikom. Slika se animira (spori zoom / lebdenje) da vizual ne bude statičan.',
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
          admin: { placeholder: 'https://.../protein-360.mp4' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Slika (fallback / poster)',
              admin: { width: '50%' },
            },
            {
              name: 'motion',
              type: 'select',
              defaultValue: 'zoom',
              label: 'Animacija slike',
              options: [
                { label: 'Spori zoom (Ken Burns)', value: 'zoom' },
                { label: 'Lebdenje', value: 'float' },
                { label: 'Bez animacije', value: 'none' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
