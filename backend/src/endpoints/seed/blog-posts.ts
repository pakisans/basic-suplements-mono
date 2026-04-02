import type { Media, PostCategory } from '@/payload-types'

import {
  bulletList,
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

type BlogSeedArgs = {
  editorialImage: Media
  heroImage: Media
  productImage: Media
  categories: {
    guides: PostCategory
    news: PostCategory
    stories: PostCategory
  }
}

export const createBlogPostsSeed = ({
  editorialImage,
  heroImage,
  productImage,
  categories,
}: BlogSeedArgs): any[] => [
  {
    title: 'Kako da pripremis ecommerce sajt za prvu kampanju',
    slug: 'kako-da-pripremis-ecommerce-sajt-za-prvu-kampanju',
    excerpt:
      'Praktican vodič za strukturu homepage-a, kategorija i proizvoda pre nego što pustiš prvi ozbiljan saobraćaj.',
    featuredImage: heroImage,
    publishedOn: new Date('2026-02-10T10:00:00.000Z').toISOString(),
    _status: 'published',
    categories: [categories.guides.id],
    content: richText(
      heading('Prvi utisak pravi razliku', 'h2'),
      paragraph(
        'Vecina novih shopova prerano krene u oglase, a da pritom homepage, kategorije i product stranice nisu uredjene kao prodajni tok.',
      ),
      paragraph(
        'Dobar seed sadrzaj ti pomaze da tim i klijent odmah vide kako ce shop izgledati kada bude popunjen pravim podacima.',
      ),
      bulletList([
        'Jasan hero sa jednom glavnom porukom',
        'Istaknute kategorije i benefiti kupovine',
        'FAQ sekcija za najcesce nedoumice',
      ]),
    ),
    layout: [
      statsBlock('Sta treba da bude spremno', [
        { label: 'Kljucne landing strane', value: '3+' },
        { label: 'Seed blog postovi', value: '3' },
        { label: 'Core CTA pozicije', value: '5' },
      ]),
      contentColumnsBlock([
        {
          size: 'half',
          texts: [
            heading('Pocni od strukture', 'h3'),
            paragraph(
              'Ako seed sadrzaj vec pokazuje hijerarhiju blokova, mnogo je lakse editoru da kasnije nastavi bez improvizacije.',
            ),
          ],
        },
        {
          size: 'half',
          texts: [
            heading('Ne seeduj samo tekst', 'h3'),
            paragraph(
              'Dodaj slike, FAQ, quote i CTA blokove kako bi admin bio realan demo, a ne prazna forma.',
            ),
          ],
        },
      ]),
      quoteBlock({
        author: 'Nemanja, implementation flow',
        role: 'Project setup',
        text: 'Najbolji starter izgleda kao gotov projekat i pre nego što klijent doda svoj prvi pravi sadržaj.',
      }),
      faqBlock('Najcesca pitanja pri postavljanju', [
        {
          question: 'Sta prvo seedovati?',
          answer: ['Kreni od medije, pa kategorije, proizvode, stranice i tek onda blog i globale.'],
        },
        {
          question: 'Da li blog vredi i pre lansiranja?',
          answer: [
            'Da, jer odmah dobijas SEO strukturu, internu navigaciju i content layout koji moze da se kopira dalje.',
          ],
        },
      ]),
    ],
    meta: {
      title: 'Kako da pripremis ecommerce sajt za prvu kampanju',
      description:
        'Koraci za pripremu homepage-a, kategorija i sadrzaja pre prve ecommerce kampanje.',
      image: heroImage,
    },
  },
  {
    title: 'Iza kulisa: kako gradimo reusable starter za prodavnicu',
    slug: 'iza-kulisa-kako-gradimo-reusable-starter-za-prodavnicu',
    excerpt:
      'Pogled iza scene kako jedan WooCommerce-like starter postaje urednicki lak za koriscenje i tehnicki bezbedan.',
    featuredImage: editorialImage,
    publishedOn: new Date('2026-02-18T09:00:00.000Z').toISOString(),
    _status: 'published',
    categories: [categories.stories.id],
    content: richText(
      heading('Starter mora da bude i tehnicki i urednicki dobar', 'h2'),
      paragraph(
        'Nije dovoljno da schema radi. Admin mora da bude pregledan, seed mora da izgleda smisleno, a blokovi moraju da vode urednika kroz posao.',
      ),
      paragraph(
        'Zato su kolekcije, globali, seed i preview pravila deo iste celine, a ne odvojeni zadaci.',
      ),
    ),
    layout: [
      contentColumnsBlock([
        {
          size: 'twoThirds',
          texts: [
            heading('Editorial UX je deo arhitekture', 'h3'),
            paragraph(
              'Kada admin deluje poznato ljudima koji dolaze iz WordPress/WooCommerce sveta, onboarding je mnogo brzi.',
            ),
            paragraph(
              'Seed data tu igra veliku ulogu jer pokazuje kako stranice i blokovi treba da izgledaju u praksi.',
            ),
          ],
        },
        {
          size: 'oneThird',
          texts: [
            heading('Core cilj', 'h3'),
            bulletList([
              'jasni tabovi',
              'smisleni blokovi',
              'realan demo sadržaj',
              'lak reuse na sledecem projektu',
            ]),
          ],
        },
      ]),
      videoBlock({
        caption: 'Kratki walkthrough seed razmisljanja',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
      ctaBlock({
        title: 'Hoces gotov seed flow i za sledeci projekat?',
        body: ['Zadrzi ovaj seed agent i koristi ga kao polaznu tacku za svaki sledeci ecommerce starter.'],
        links: [
          { label: 'Idi na kontakt', url: '/contact' },
          { appearance: 'outline', label: 'Pogledaj blog', url: '/blog' },
        ],
      }),
    ],
    meta: {
      title: 'Iza kulisa reusable ecommerce startera',
      description: 'Kako izgleda proces kada starter gradimo da bude i reusable i urednicki prijatan.',
      image: editorialImage,
    },
  },
  {
    title: 'Zasto blog i shop moraju da rade zajedno',
    slug: 'zasto-blog-i-shop-moraju-da-rade-zajedno',
    excerpt:
      'Blog nije dodatak sa strane. On pomaze kategorijama, proizvodima i pretrazi da imaju mnogo jacu pricu i SEO strukturu.',
    featuredImage: productImage,
    publishedOn: new Date('2026-03-02T08:30:00.000Z').toISOString(),
    _status: 'published',
    categories: [categories.news.id],
    content: richText(
      heading('Sadrzaj i prodaja ne treba da budu odvojeni svetovi', 'h2'),
      paragraph(
        'Kada blog deli istu vizuelnu i content logiku sa ostatkom sajta, mnogo je lakse da korisnik iz informativnog sadrzaja dodje do kupovine.',
      ),
      paragraph(
        'To je razlog zasto seed blog postovi treba da koriste iste blokove i isti tonalitet kao stranice.',
      ),
    ),
    layout: [
      statsBlock('Zasto se isplati', [
        { label: 'Jaci internal linking', value: '100%' },
        { label: 'Bolji SEO foundation', value: 'Da' },
        { label: 'Vise reusable blokova', value: 'Mnogo' },
      ]),
      faqBlock('Blog + ecommerce', [
        {
          question: 'Da li blog pomaze prodaji?',
          answer: ['Da, kada vodi ka kategorijama, proizvodima i jasnim CTA sekcijama.'],
        },
        {
          question: 'Sta blog treba da seeduje?',
          answer: ['Arhivu, single post view, kategorije i makar nekoliko povezanih tema.'],
        },
      ]),
      spacerBlock('lg', true),
      quoteBlock({
        author: 'Seed agent pravilo',
        text: 'Ako blog nije popunjen demo podacima, pola urednickog iskustva ostaje nevidljivo.',
      }),
    ],
    meta: {
      title: 'Zasto blog i shop moraju da rade zajedno',
      description: 'Kako blog podize SEO, internu navigaciju i kvalitet ecommerce iskustva.',
      image: productImage,
    },
  },
]
