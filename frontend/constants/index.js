export const INTERNAL_PAYLOAD_URL = process.env.PAYLOAD_URL;
export const PUBLIC_PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const PAYLOAD_URL =
  typeof window === 'undefined' ? INTERNAL_PAYLOAD_URL : PUBLIC_PAYLOAD_URL;

export const DEFAULT_LOCALE = 'sr';

export const SITE_NAME = 'Prodavnica';
export const SITE_DESCRIPTION = 'Online prodavnica';
export const SITE_TAGLINE = 'Kvalitet koji traje';

export const ROUTES = {
  home: '/',
  products: '/proizvodi',
  blog: '/blog',
  brands: '/brendovi',
  cart: '/korpa',
  checkout: '/naplata',
  search: '/pretraga',
  account: '/nalog',
  orders: '/nalog/porudzbine',
  login: '/login',
};

export const REVALIDATE = {
  products: 60,
  categories: 300,
  pages: 300,
  posts: 60,
  globals: 600,
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
  new: 'Novo',
  sale: 'Akcija',
  bestseller: 'Bestseler',
  featured: 'Istaknuto',
  limited: 'Ograničeno',
  preorder: 'Prednarudžba',
};

export const VISIBILITY_OPTIONS = {
  visible: 'visible',
  hidden: 'hidden',
  search_only: 'search_only',
};

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Najnovije' },
  { value: '-createdAt', label: 'Najstarije' },
  { value: 'price', label: 'Cena: manja prema većoj' },
  { value: '-price', label: 'Cena: veća prema manjoj' },
  { value: 'title', label: 'Naziv A-Z' },
  { value: '-title', label: 'Naziv Z-A' },
];

export const SPACER_SIZES = {
  xs: '1rem',
  sm: '2rem',
  md: '4rem',
  lg: '6rem',
  xl: '8rem',
};
