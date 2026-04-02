import {
  PUBLIC_PAYLOAD_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SERVER_URL,
} from '@/constants';

export function getMediaUrl(media) {
  if (!media) return undefined;
  if (typeof media === 'string')
    return media.startsWith('http') ? media : `${PUBLIC_PAYLOAD_URL}${media}`;
  if (media.url) return `${PUBLIC_PAYLOAD_URL}${media.url}`;
  return undefined;
}

export function buildMetadata(options = {}) {
  const {
    title,
    description = SITE_DESCRIPTION,
    image,
    canonical,
    noIndex = false,
    keywords,
  } = options;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const imageUrl = getMediaUrl(image);

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SERVER_URL),
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      siteName: SITE_NAME,
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
  const { title, description, image, price, slug, meta } = options;
  const metaTitle = meta?.title ?? title;
  const metaDescription = meta?.description ?? description;
  const metaImage = meta?.image ?? image;

  const base = buildMetadata({
    title: metaTitle,
    description: metaDescription,
    image: metaImage,
    canonical: `/proizvodi/${slug}`,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'website',
    },
    other: price !== undefined ? { product_price: String(price) } : undefined,
  };
}

export function buildCategoryMetadata(options = {}) {
  const { title, description, image, path, seo } = options;

  return buildMetadata({
    title: seo?.title ?? title,
    description: seo?.description ?? description,
    image: seo?.image ?? image,
    canonical: `/proizvodi/${path}`,
  });
}

export function productJsonLd(options = {}) {
  const {
    name,
    description,
    image,
    price,
    sku,
    availability = 'InStock',
    brand,
    url,
  } = options;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url,
    ...(description && { description }),
    ...(image && { image }),
    ...(sku && { sku }),
    ...(brand && {
      brand: {
        '@type': 'Brand',
        name: brand,
      },
    }),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RSD',
      ...(price !== undefined && { price }),
      availability: `https://schema.org/${availability}`,
      url,
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
      item: item.url ? `${SERVER_URL}${item.url}` : undefined,
    })),
  });
}

export function organizationJsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SERVER_URL,
  });
}
