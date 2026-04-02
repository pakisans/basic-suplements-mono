import type { Form, Media } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  contentColumnsBlock,
  faqBlock,
  heading,
  paragraph,
  quoteBlock,
  richText,
  spacerBlock,
  statsBlock,
} from './richText'

type ContactArgs = {
  contactForm: Form
  contactImage: Media
}

export const contactPageData: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
  contactImage,
}) => ({
  slug: 'contact',
  title: 'Kontakt',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    media: contactImage,
    richText: richText(
      heading('Kontaktiraj nas bez komplikacije', 'h1'),
      paragraph(
        'Kontakt strana je seedovana tako da odmah izgleda kao prava servisna stranica, sa odgovorima, kontakt podacima i formom.',
      ),
    ),
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Posalji upit',
          url: '#contact-form',
        },
      },
    ],
  },
  layout: [
    contentColumnsBlock([
      {
        size: 'half',
        texts: [
          heading('Prodaja i saradnja', 'h2'),
          paragraph('Pisite nam kada vam treba novi ecommerce setup, migracija ili urednicki friendly starter.'),
        ],
      },
      {
        size: 'half',
        texts: [
          heading('Podrska i pitanja', 'h2'),
          paragraph('Ako vec radimo zajedno, ova strana moze lako da preraste u pravi support i contact hub.'),
        ],
      },
    ]),
    statsBlock('Brzi pregled', [
      { label: 'Odgovor u toku dana', value: '<24h' },
      { label: 'Kanali komunikacije', value: '3' },
      { label: 'Seed sekcije spremne', value: 'Da' },
    ]),
    faqBlock('Najcesca pitanja', [
      {
        question: 'Da li ova kontakt strana moze da se prosiri?',
        answer: ['Da, mozes dodati mape, tim sekciju, office informacije ili dodatne CTA blokove.'],
      },
      {
        question: 'Da li forma vec radi?',
        answer: ['Da, seed koristi postojeći form builder i odmah puni stranicu realnim blokom forme.'],
      },
    ]),
    quoteBlock({
      author: 'Kontakt seed princip',
      text: 'Servisne strane treba da izgledaju zavrseno isto koliko i prodajne.',
    }),
    spacerBlock('sm', true),
    {
      blockType: 'formBlock',
      form: contactForm.id,
      enableIntro: true,
      introContent: richText(
        heading('Posalji nam poruku', 'h3'),
        paragraph('Popuni formu i koristi seed stranicu kao polaznu tacku za pravi kontakt funnel.'),
      ),
      blockName: 'contact-form',
    },
  ],
  meta: {
    title: 'Kontakt',
    description: 'Kontakt strana sa formom, FAQ blokom i spremnim seed rasporedom.',
    image: contactImage,
  },
})
