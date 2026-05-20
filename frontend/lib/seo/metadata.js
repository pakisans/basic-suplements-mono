import {
  PUBLIC_PAYLOAD_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_SOCIAL,
  SERVER_URL,
} from '@/constants';

export function getMediaUrl(media) {
  if (!media) return undefined;
  if (typeof media === 'string')
    return media.startsWith('http') ? media : `${PUBLIC_PAYLOAD_URL}${media}`;
  if (media.url) return `${PUBLIC_PAYLOAD_URL}${media.url}`;
  return undefined;
}

function absoluteUrl(path) {
  if (!path) return SERVER_URL;
  if (path.startsWith('http')) return path;
  return `${SERVER_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildMetadata(options = {}) {
  const {
    title,
    description = SITE_DESCRIPTION,
    image,
    canonical,
    noIndex = false,
    keywords,
    type = 'website',
  } = options;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const imageUrl = getMediaUrl(image);
  const canonicalUrl = canonical ? absoluteUrl(canonical) : undefined;

  return {
    title: fullTitle,
    description,
    ...(keywords && { keywords }),
    metadataBase: new URL(SERVER_URL),
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false, 'max-snippet': -1 },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description,
      type,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      ...(canonicalUrl && { url: canonicalUrl }),
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export function buildProductMetadata(options = {}) {
  const { title, description, image, slug, meta } = options;

  return buildMetadata({
    title: meta?.title ?? title,
    description: meta?.description ?? description,
    image: meta?.image ?? image,
    canonical: `/products/${slug}`,
    type: 'website',
  });
}

export function buildCategoryMetadata(options = {}) {
  const { title, description, image, path, seo } = options;

  return buildMetadata({
    title: seo?.title ?? title,
    description: seo?.description ?? description,
    image: seo?.image ?? image,
    canonical: `/products/${path}`,
  });
}

export function buildBlogMetadata(options = {}) {
  const { title, description, image, slug, meta } = options;

  return buildMetadata({
    title: meta?.title ?? title,
    description: meta?.description ?? description,
    image: meta?.image ?? image,
    canonical: `/blog/${slug}`,
    type: 'article',
  });
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

export function websiteJsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SERVER_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SERVER_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });
}

export function organizationJsonLd(options = {}) {
  const { logo, sameAs = [] } = options;
  const logoUrl = getMediaUrl(logo);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SERVER_URL,
    ...(logoUrl && {
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
        width: 320,
        height: 110,
      },
    }),
    sameAs: [...Object.values(SITE_SOCIAL), ...sameAs].filter(Boolean),
  });
}

export function productJsonLd(options = {}) {
  const {
    name,
    description,
    images = [],
    sku,
    availability = 'InStock',
    brand,
    url,
  } = options;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url: absoluteUrl(url),
    ...(description && { description }),
    ...(images.length && { image: images }),
    ...(sku && { sku }),
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    offers: {
      '@type': 'Offer',
      availability: `https://schema.org/${availability}`,
      url: absoluteUrl(url),
      priceCurrency: 'RSD',
    },
  });
}

export function articleJsonLd(options = {}) {
  const { title, description, image, url, publishedAt, modifiedAt, authorName } = options;
  const imageUrl = getMediaUrl(image);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    ...(description && { description }),
    ...(imageUrl && { image: [imageUrl] }),
    url: absoluteUrl(url),
    datePublished: publishedAt,
    ...(modifiedAt && { dateModified: modifiedAt }),
    author: {
      '@type': 'Organization',
      name: authorName ?? SITE_NAME,
      url: SERVER_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SERVER_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(url),
    },
  });
}

export function breadcrumbJsonLd(items = []) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: absoluteUrl(item.url) }),
    })),
  });
}

export function collectionPageJsonLd(options = {}) {
  const { name, description, url } = options;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    ...(description && { description }),
    url: absoluteUrl(url),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SERVER_URL },
  });
}
