export const INTERNAL_PAYLOAD_URL = process.env.PAYLOAD_URL;
export const PUBLIC_PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const PAYLOAD_URL =
  typeof window === 'undefined' ? INTERNAL_PAYLOAD_URL : PUBLIC_PAYLOAD_URL;

export const DEFAULT_LOCALE = 'en';

export const SITE_NAME = 'Basic Supplements';
export const SITE_DESCRIPTION = 'Premium sports nutrition and supplements. Fuel your performance.';
export const SITE_TAGLINE = 'Fuel Your Performance';

export const ROUTES = {
  home: '/',
  products: '/products',
  blog: '/blog',
  brands: '/brands',
  cart: '/cart',
  checkout: '/checkout',
  search: '/search',
  account: '/account',
  orders: '/account/orders',
  login: '/login',
};

export const REVALIDATE = {
  products: 30,
  categories: 30,
  pages: 60,
  posts: 30,
  globals: 60,
};

export const CURRENCY = {
  code: 'RSD',
  symbol: 'RSD',
  symbolPosition: 'after',
  thousandsSeparator: '.',
};

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;

export const IMAGE_SIZES = {
  card: { width: 400, height: 500 },
  gallery: { width: 800, height: 1000 },
  hero: { width: 1920, height: 1080 },
  avatar: { width: 96, height: 96 },
  logo: { width: 200, height: 80 },
};

export const SOCIAL_PLATFORMS = {
  instagram: { label: 'Instagram', icon: 'instagram' },
  facebook: { label: 'Facebook', icon: 'facebook' },
  tiktok: { label: 'TikTok', icon: 'tiktok' },
  youtube: { label: 'YouTube', icon: 'youtube' },
  twitter: { label: 'Twitter / X', icon: 'twitter' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  pinterest: { label: 'Pinterest', icon: 'pinterest' },
  whatsapp: { label: 'WhatsApp', icon: 'whatsapp' },
  viber: { label: 'Viber', icon: 'viber' },
};

export const BADGE_LABELS = {
  new: 'New',
  sale: 'Sale',
  bestseller: 'Bestseller',
  featured: 'Featured',
  limited: 'Limited',
  preorder: 'Pre-order',
};

export const VISIBILITY_OPTIONS = {
  visible: 'visible',
  hidden: 'hidden',
  search_only: 'search_only',
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt',  label: 'Oldest first' },
  { value: 'price',      label: 'Price: low to high' },
  { value: '-price',     label: 'Price: high to low' },
  { value: 'title',      label: 'Name A–Z' },
  { value: '-title',     label: 'Name Z–A' },
];

export const SPACER_SIZES = {
  xs: '1rem',
  sm: '2rem',
  md: '4rem',
  lg: '6rem',
  xl: '8rem',
};
