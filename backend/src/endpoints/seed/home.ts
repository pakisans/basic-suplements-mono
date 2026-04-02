import type { Media, Product } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  contentColumnsBlock,
  ctaBlock,
  faqBlock,
  heading,
  paragraph,
  quoteBlock,
  richText,
  spacerBlock,
  statsBlock,
  videoBlock,
} from './richText'

type HomeArgs = {
  featuredProducts: Product[]
  heroImage: Media
  metaImage: Media
}

export const homePageData: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  featuredProducts,
  heroImage,
  metaImage,
}) => ({
  slug: 'home',
  title: 'Pocetna',
  _status: 'published',
  hero: {
    type: 'mediumImpact',
    media: heroImage,
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Kupi kolekciju',
          url: '/shop',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Procitaj blog',
          url: '/blog',
        },
      },
    ],
    richText: richText(
      heading('Starter za prodavnicu koji izgleda spremno za lansiranje', 'h1'),
      paragraph(
        'Seed sadrzaj je slozen tako da odmah dobijes smislen homepage, kontakt stranu, blog i uredjen footer bez praznih placeholder sekcija.',
      ),
    ),
  },
  layout: [
    statsBlock('Zasto je ovaj demo koristan', [
      { label: 'Popunjene kljucne strane', value: '3+' },
      { label: 'Blog postovi', value: '3' },
      { label: 'Reusable blokovi', value: '8+' },
    ]),
    contentColumnsBlock([
      {
        size: 'half',
        texts: [
          heading('WooCommerce osecaj, Payload arhitektura', 'h2'),
          paragraph(
            'Administracija je organizovana tako da bude poznata urednicima, ali je kod ostao modularan i spreman za dalji razvoj.',
          ),
        ],
      },
      {
        size: 'half',
        texts: [
          heading('Seed koji stvarno demonstrira projekat', 'h2'),
          paragraph(
            'Umesto praznih stranica, dobijas gotove rasporede sa CTA, FAQ, quote, stats i carousel blokovima.',
          ),
        ],
      },
    ]),
    {
      blockType: 'carousel',
      populateBy: 'selection',
      selectedDocs: featuredProducts.map((product) => ({
        relationTo: 'products',
        value: product.id,
      })),
    },
    quoteBlock({
      author: 'Starter principle',
      role: 'Editorial setup',
      text: 'Kada seed izgleda kao gotov demo, mnogo je lakse prodati pravac projekta i nastaviti sa pravim sadržajem.',
    }),
    faqBlock('Cesta pitanja pre lansiranja', [
      {
        question: 'Da li homepage mora da bude kompletan i pre pravog sadržaja?',
        answer: [
          'Da, jer seed homepage sluzi kao obrazac za urednike i kao demo kvaliteta projekta pred klijentom.',
        ],
      },
      {
        question: 'Zasto seedovati i blog?',
        answer: [
          'Zato sto blog utice na navigaciju, SEO i pokazuje kako fleksibilni blokovi rade i van klasicnih landing stranica.',
        ],
      },
    ]),
    videoBlock({
      caption: 'Primer embedded video bloka na pocetnoj',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }),
    spacerBlock('md', true),
    ctaBlock({
      title: 'Hoces stranicu spremnu za prilagodjavanje?',
      body: [
        'Kreni od postojeceg seed rasporeda i menjaj tekstove, slike i CTA poruke bez potrebe da sve sastavljas od nule.',
      ],
      links: [
        { label: 'Kontaktiraj nas', url: '/contact' },
        { appearance: 'outline', label: 'Idi na shop', url: '/shop' },
      ],
    }),
  ],
  meta: {
    title: 'Reusable ecommerce starter',
    description:
      'Pocetna strana sa smislenim seed rasporedom za ecommerce projekat, blog i kontakt.',
    image: metaImage,
  },
})
