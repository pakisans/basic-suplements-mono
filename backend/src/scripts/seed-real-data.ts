/**
 * seed-real-data.ts
 *
 * Seeds Header, Footer globals, and content pages for Basic Supplements.
 * Run: pnpm seed:real-data
 */

import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

// ─── Link helper ───────────────────────────────────────────────────────────────

function customLink(label: string, url: string, newTab = false) {
  return { link: { type: 'custom' as const, label, url, newTab } }
}

// ─── Lexical helpers ──────────────────────────────────────────────────────────

function para(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    textFormat: 0,
    children: [{ type: 'text', format: 0, mode: 'normal', style: '', text, version: 1 }],
  }
}

function heading(tag: 'h1' | 'h2' | 'h3' | 'h4', text: string) {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    children: [{ type: 'text', format: 0, mode: 'normal', style: '', text, version: 1 }],
  }
}

function lexicalDoc(...nodes: object[]) {
  return {
    root: { type: 'root', format: '', indent: 0, version: 1, children: nodes },
  }
}

function lexicalParagraphs(...texts: string[]) {
  return lexicalDoc(...texts.map(para))
}

// ─── Home page block builder (needs live IDs from DB) ────────────────────────

function buildHomePageBlocks(opts: {
  firstMediaId: number | string | null
  contactFormId: number | string | null
}) {
  const { firstMediaId, contactFormId } = opts

  return [
    // 1. Carousel — auto-populate all products (no IDs needed)
    {
      blockType: 'carousel',
      populateBy: 'collection',
      relationTo: 'products',
      limit: 6,
    },

    // 2. ThreeItemGrid — placeholder (client fills via CMS)
    // Skipped: requires exactly 3 manually-selected products

    // 2. Stats — placed here instead
    // (ThreeItemGrid rendered as empty gracefully in CMS)

    // 3. Stats — key brand numbers
    {
      blockType: 'stats',
      heading: 'By the Numbers',
      items: [
        { value: '10,000+', label: 'Athletes Served' },
        { value: '80+', label: 'Premium Products' },
        { value: '5.0★', label: 'Average Rating' },
        { value: '100%', label: 'Made in Serbia' },
      ],
    },

    // 4. Content — two brand pillars
    {
      blockType: 'content',
      columns: [
        {
          richText: lexicalDoc(
            heading('h2', 'Premium Ingredients, No Compromises'),
            para(
              "Every scoop of Basic Supplements protein contains only what you need — high-grade whey sourced from EU-certified dairies, full amino acid profiles, zero proprietary blends, and no underdosed fillers. What's on the label is what's in the tub.",
            ),
          ),
          enableLink: false,
        },
        {
          richText: lexicalDoc(
            heading('h2', 'Transparent. Tested. Trusted.'),
            para(
              'We believe athletes deserve honesty. Every product undergoes independent third-party testing before it reaches your door. Our manufacturing facility holds EU GMP certification — the same standard applied to pharmaceutical products.',
            ),
          ),
          enableLink: false,
        },
      ],
    },

    // 5. Quote — customer testimonial
    {
      blockType: 'quote',
      text: "I've tried dozens of protein brands over the years. Basic Supplements PRO WHEY is the first one where I actually noticed a difference in recovery. Clean ingredients, great taste, and it works — what more do you need?",
      author: 'Nikola M.',
      role: 'Competitive Bodybuilder, Belgrade',
      rating: '5',
    },

    // 6. Spacer (divider)
    { blockType: 'spacer', size: 'sm', showDivider: true },

    // 7. BrandStory — split layout, cover
    {
      blockType: 'brandStory',
      eyebrow: 'Our Mission',
      heading: 'Built for Those Who Go Further',
      description: lexicalParagraphs(
        'Basic Supplements was founded in Novi Sad with a single mission: give serious athletes access to premium-grade nutrition at honest prices. No middlemen, no celebrity mark-ups, no compromise on quality.',
        'We source raw materials directly from EU-certified suppliers, formulate every product in-house, and manufacture right here in Serbia — controlling every step from ingredient to label.',
      ),
      layout: 'image-right',
      imageFit: 'cover',
      stats: [
        { value: '2018', label: 'Year Founded' },
        { value: '80+', label: 'Products' },
        { value: '10k+', label: 'Happy Athletes' },
        { value: 'GMP', label: 'Certified Facility' },
      ],
      cta: { label: 'Our Story', url: '/about' },
    },

    // 8. MediaBlock — lifestyle / brand image
    ...(firstMediaId ? [{ blockType: 'mediaBlock', media: firstMediaId }] : []),

    // 9. Banner — seasonal promotion
    {
      blockType: 'banner',
      style: 'info',
      content: lexicalDoc(
        heading('h2', 'New Season. New Goals.'),
        para(
          'Our Spring 2025 collection has arrived — upgraded formulas, new flavours, and limited-edition bundles built for your best season yet. Use code SPRING25 for 15% off your first order.',
        ),
      ),
    },

    // 10. CallToAction — main shop CTA
    {
      blockType: 'cta',
      richText: lexicalDoc(
        heading('h2', 'Ready to Level Up?'),
        para(
          'Find your perfect stack. From whey protein and creatine to pre-workout and vitamins — everything you need to perform at your peak, all in one place.',
        ),
      ),
      links: [
        {
          link: {
            type: 'custom' as const,
            label: 'Shop All Products',
            url: '/products',
            appearance: 'default',
          },
        },
        {
          link: {
            type: 'custom' as const,
            label: 'View Bundles',
            url: '/products?category=bundles',
            appearance: 'outline',
          },
        },
      ],
    },

    // 11. Spacer (divider)
    { blockType: 'spacer', size: 'sm', showDivider: true },

    // 12. Ambassador — Vaso Bakočević
    {
      blockType: 'ambassador',
      eyebrow: 'Best Selling Brand',
      heading: 'Introducing BASIC SUPPLEMENTS',
      role: 'Premium Supplements for Athletes & Everyday Performance',
      description: lexicalParagraphs(
        'Basic Supplements is more than just a sports nutrition brand. Our product range is designed for everyone who wants to improve their physical performance, strength, recovery, and overall lifestyle — from professional athletes to everyday fitness enthusiasts.',
        'Built around premium-quality ingredients and proven formulas, Basic Supplements delivers high-performance products at accessible prices, helping you push further every single day.',
        'Through our trusted OGISTRA Nutrition Shop distribution network, customers across Serbia and Europe can access a complete range of supplements, expert support, exclusive offers, and a growing fitness community dedicated to progress and results.',
        'BE THE BEST WITH OGISTRA NUTRITION SHOP!',
      ),
      layout: 'media-right',
      video: { platform: 'youtube', url: 'https://www.youtube.com/watch?v=t5Jy-X-9PU0' },
      cta: { label: 'Shop BASIC SUPPLEMENTS', url: '/products' },
    },

    // 13. BrandStory — Full Image background mode
    {
      blockType: 'brandStory',
      eyebrow: 'Quality Assurance',
      heading: 'Manufactured to EU Standards',
      description: lexicalParagraphs(
        'Our Novi Sad production facility operates under full EU GMP certification — the same standards applied to pharmaceutical manufacturing. Every batch is independently tested for purity, potency, and label accuracy.',
        'When you open a Basic Supplements product, you can trust that it contains exactly what we say it does. Nothing more, nothing less.',
      ),
      layout: 'image-right',
      imageFit: 'contain',
      cta: { label: 'Learn About Our Quality', url: '/about' },
    },

    // 14. Video — YouTube brand video
    {
      blockType: 'video',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=AbjIQ52lFcg',
      caption: 'Basic Supplements — Fuel Your Performance',
    },

    // 15. Spacer (divider)
    { blockType: 'spacer', size: 'sm', showDivider: true },

    // 16. FAQ — common supplement questions
    {
      blockType: 'faq',
      heading: 'Everything You Need to Know',
      items: [
        {
          question: 'What is the difference between whey concentrate and whey isolate?',
          answer: lexicalParagraphs(
            "Whey concentrate contains 70–80% protein with some lactose and fat remaining — cost-effective and great for most people. Whey isolate is filtered to 90%+ protein with minimal lactose and fat, making it ideal if you're lactose-sensitive or in a strict cutting phase.",
          ),
        },
        {
          question: 'How much creatine should I take per day?',
          answer: lexicalParagraphs(
            "The well-researched dose is 3–5 g of creatine monohydrate per day. You don't need a loading phase — consistent daily use over 2–4 weeks fully saturates your muscle creatine stores. Timing is not critical; take it whenever is convenient.",
          ),
        },
        {
          question: 'Are Basic Supplements products tested for banned substances?',
          answer: lexicalParagraphs(
            'Yes. Our products are manufactured in an EU GMP-certified facility and undergo third-party batch testing for heavy metals, microbial contamination, and label accuracy. We maintain full transparency about our testing processes on every product page.',
          ),
        },
        {
          question: "Can I return a product if I'm not satisfied?",
          answer: lexicalParagraphs(
            'We accept returns on sealed, unopened products within 14 days of purchase. If you received a damaged or incorrect item, contact us at info@basic-supplements.com and we will resolve it immediately.',
          ),
        },
        {
          question: 'How long does delivery take?',
          answer: lexicalParagraphs(
            'Orders within Serbia are typically delivered within 1–3 business days. We dispatch same-day for orders placed before 14:00 on working days. Free shipping is available on all orders over 5,000 RSD.',
          ),
        },
      ],
    },

    // 17. Archive — all products listing
    {
      blockType: 'archive',
      introContent: lexicalDoc(
        heading('h2', 'Shop the Full Range'),
        para(
          'Browse our complete catalogue — from premium proteins to performance supplements and lifestyle gear.',
        ),
      ),
      populateBy: 'collection',
      relationTo: 'products',
      limit: 8,
    },

    // 19. FormBlock — contact form
    ...(contactFormId
      ? [
          {
            blockType: 'formBlock',
            form: contactFormId,
            enableIntro: true,
            introContent: lexicalDoc(
              heading('h2', 'Get in Touch'),
              para(
                'Have a question about our products, an order, or anything else? Fill in the form and we will get back to you within 24 hours.',
              ),
            ),
          },
        ]
      : []),

    // 20. Final spacer
    { blockType: 'spacer', size: 'md', showDivider: false },
  ]
}

function buildHomePageData(blocks: object[]) {
  return {
    title: 'Home',
    slug: 'home',
    _status: 'published',
    hero: { type: 'none' },
    layout: blocks,
  }
}

// ─── About page blocks ────────────────────────────────────────────────────────

const aboutPageBlocks = [
  {
    blockType: 'brandStory',
    eyebrow: 'Our Story',
    heading: 'Built for Those Who Go Further',
    description: lexicalParagraphs(
      'BASIC SUPPLEMENTS was founded with a single mission: to give serious athletes and everyday gym-goers access to the same premium-grade nutrition that professionals use — without the inflated price tags.',
      'Every product in our lineup is developed in collaboration with top-tier athletes, tested rigorously, and manufactured to the highest European quality standards. No fillers, no compromises, no excuses.',
    ),
    layout: 'image-right',
    imageFit: 'cover',
    stats: [
      { value: '10,000+', label: 'Athletes served' },
      { value: '80+', label: 'Premium products' },
      { value: '5★', label: 'Average rating' },
      { value: '100%', label: 'Made in Serbia' },
    ],
    cta: { label: 'Explore Our Products', url: '/products' },
  },
  {
    blockType: 'ambassador',
    eyebrow: 'Official Ambassador',
    heading: 'Vaso Bakočević',
    role: 'World-Class Powerlifter & Fitness Icon',
    description: lexicalParagraphs(
      'One of the most recognisable faces in Serbian strength sports, Vaso Bakočević embodies everything BASIC SUPPLEMENTS stands for — relentless discipline, raw power, and an uncompromising pursuit of greatness.',
      'Vaso has been part of the BASIC family since day one, co-developing our P-5 pre-workout line and pushing every formula to its limits in the gym before it ever reaches your hands.',
    ),
    layout: 'media-right',
    video: {
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=AbjIQ52lFcg',
    },
    cta: { label: 'Shop the Ambassador Line', url: '/products' },
  },
]

const aboutPageData = {
  title: 'About Basic Supplements',
  slug: 'about',
  _status: 'published',
  hero: { type: 'none' },
  layout: aboutPageBlocks,
}

// ─── Header ────────────────────────────────────────────────────────────────────

const headerData = {
  siteName: 'Basic Supplements',

  topBar: [
    { link: { type: 'custom' as const, label: 'Locations', url: '/locations' } },
    { link: { type: 'custom' as const, label: 'Active Club', url: '/active-club' } },
    { link: { type: 'custom' as const, label: 'FAQ', url: '/faq' } },
    { link: { type: 'custom' as const, label: 'Contact', url: '/contact' } },
    { link: { type: 'custom' as const, label: 'B2B', url: '/b2b' } },
  ],

  navItems: [
    {
      link: { type: 'custom' as const, label: 'Products', url: '/products' },
      subItems: [
        { link: { type: 'custom' as const, label: 'All Products', url: '/products' } },
        { link: { type: 'custom' as const, label: 'Proteins', url: '/products/proteins' } },
        { link: { type: 'custom' as const, label: 'Amino Acids', url: '/products/amino-acids' } },
        { link: { type: 'custom' as const, label: 'Creatines', url: '/products/creatines' } },
        { link: { type: 'custom' as const, label: 'Pre-Workout', url: '/products/pre-workout' } },
        { link: { type: 'custom' as const, label: 'Vitamins & Minerals', url: '/products/vitamins-and-minerals' } },
        { link: { type: 'custom' as const, label: 'Sports Clothing', url: '/products/sports-clothing' } },
        { link: { type: 'custom' as const, label: 'Super Deals', url: '/products/super-deals' } },
      ],
    },
    {
      link: { type: 'custom' as const, label: 'About', url: '/about' },
      subItems: [],
    },
    {
      link: { type: 'custom' as const, label: 'Collaborations', url: '/collaborations' },
      subItems: [],
    },
  ],

  promoBanner: {
    enabled: true,
    text: 'Free shipping on orders over 5,000 RSD — Use code WELCOME10 for 10% off your first order',
    link: { type: 'custom' as const, label: 'Shop Now', url: '/products' },
  },
}

// ─── Footer ────────────────────────────────────────────────────────────────────

const footerNavItems = [
  customLink('Products', '/products'),
  customLink('About', '/about'),
  customLink('Contact', '/contact'),
]

const footerSections = [
  {
    blockType: 'footerBrand',
    tagline: 'Made in EU. Built for Athletes.',
    description:
      'Premium sports nutrition manufactured in the EU — crafted from carefully selected raw materials, quality-certified and rigorously tested. Built for athletes who demand reliable and effective results.',
  },
  {
    blockType: 'footerColumn',
    title: 'Categories',
    links: [
      customLink('Proteins', '/products/proteins'),
      customLink('Amino Acids', '/products/amino-acids'),
      customLink('Creatines', '/products/creatines'),
      customLink('Pre-Workout', '/products/pre-workout'),
      customLink('Vitamins & Minerals', '/products/vitamins-and-minerals'),
      customLink('Sports Clothing', '/products/sports-clothing'),
      customLink('Super Deals', '/products/super-deals'),
    ],
  },
  {
    blockType: 'footerColumn',
    title: 'Pages',
    links: [
      customLink('Shop', '/products'),
      customLink('Locations', '/locations'),
      customLink('Business Offer', '/b2b'),
      customLink('Contact', '/contact'),
      customLink('FAQ', '/faq'),
      customLink('Blog', '/blog'),
    ],
  },
  {
    blockType: 'footerNewsletter',
    heading: 'Newsletter',
    description: 'Subscribe and be the first to hear about new products, exclusive offers, and training tips.',
    buttonLabel: 'Subscribe',
    privacyNote: 'No spam. Unsubscribe anytime.',
  },
]

const footerBottomBar = {
  copyright: `© ${new Date().getFullYear()} Basic Supplements. All rights reserved.`,
  legalLinks: [
    customLink('Importer & Distributor: TR. OGISTRA', '#'),
    customLink('Privacy Policy', '/privacy-policy'),
  ],
}

// ─── Upsert helper ────────────────────────────────────────────────────────────

async function upsertPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  req: Awaited<ReturnType<typeof createLocalReq>>,
  slug: string,
  data: object,
  label: string,
) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    req,
  })
  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      locale: 'en',
      req,
      data: data as any,
    })
    payload.logger.info(`  Updated existing ${label}.`)
  } else {
    await payload.create({
      collection: 'pages',
      locale: 'en',
      req,
      data: data as any,
    })
    payload.logger.info(`  Created ${label}.`)
  }
}

// ─── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  const payload = await getPayload({ config })
  const req = await createLocalReq({ locale: 'en' }, payload)

  payload.logger.info('Seeding Header…')
  await payload.updateGlobal({ slug: 'header', locale: 'en', req, data: headerData } as any)

  payload.logger.info('Seeding Footer…')
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    req,
    data: { navItems: footerNavItems, sections: footerSections, bottomBar: footerBottomBar },
  } as any)

  // ─── Fetch first media for MediaBlock ─────────────────────────────────────
  payload.logger.info('Fetching media for MediaBlock…')
  const mediaResult = await payload.find({ collection: 'media', limit: 1, depth: 0, req })
  const firstMediaId: any = mediaResult.docs[0]?.id ?? null
  payload.logger.info(`  First media ID: ${firstMediaId ?? 'none'}`)

  // ─── Upsert contact form for FormBlock ────────────────────────────────────
  payload.logger.info('Upserting Contact form…')
  let contactFormId: any = null
  try {
    const existingForms = await payload.find({
      collection: 'forms',
      where: { title: { equals: 'Contact Form' } },
      limit: 1,
      req,
    })
    if (existingForms.docs.length > 0) {
      contactFormId = existingForms.docs[0].id
      payload.logger.info(`  Using existing Contact form (${contactFormId}).`)
    } else {
      const form = await payload.create({
        collection: 'forms',
        req,
        data: {
          title: 'Contact Form',
          fields: [
            { blockType: 'text', name: 'fullName', label: 'Full Name', required: true, width: 50 },
            {
              blockType: 'email',
              name: 'email',
              label: 'Email Address',
              required: true,
              width: 50,
            },
            { blockType: 'text', name: 'subject', label: 'Subject', required: false, width: 100 },
            { blockType: 'textarea', name: 'message', label: 'Message', required: true },
          ],
          submitButtonLabel: 'Send Message',
          confirmationType: 'message',
          confirmationMessage: lexicalParagraphs(
            'Thank you for reaching out! We will get back to you within 24 hours.',
          ),
        } as any,
      })
      contactFormId = form.id
      payload.logger.info(`  Created Contact form (${contactFormId}).`)
    }
  } catch (err) {
    payload.logger.warn(`  Could not create form: ${err}. FormBlock will be skipped.`)
  }

  // ─── Build and seed Home page ──────────────────────────────────────────────
  payload.logger.info('Seeding Home page…')
  const homeBlocks = buildHomePageBlocks({ firstMediaId, contactFormId })
  await upsertPage(payload, req, 'home', buildHomePageData(homeBlocks), 'Home page')

  // ─── Seed About page ───────────────────────────────────────────────────────
  payload.logger.info('Seeding About page…')
  await upsertPage(payload, req, 'about', aboutPageData, 'About page')

  payload.logger.info('✓ Header, Footer, Home & About pages seeded successfully.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
