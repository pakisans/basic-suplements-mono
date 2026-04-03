import { NextResponse } from 'next/server';
import { INTERNAL_PAYLOAD_URL, DEFAULT_LOCALE } from '@/constants';

export const runtime = 'nodejs';

const API_URL = `${INTERNAL_PAYLOAD_URL}/api`;

function withTimeout(ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(id),
  };
}

async function fetchJSON(url) {
  const { signal, clear } = withTimeout();

  try {
    const res = await fetch(url, {
      signal,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clear();
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q') ?? '';
  const query = rawQuery.trim();

  if (query.length < 2) {
    return NextResponse.json({
      products: [],
      posts: [],
    });
  }

  const productParams = new URLSearchParams({
    'where[title][like]': query,
    'where[_status][equals]': 'published',
    'where[visibility][not_equals]': 'hidden',
    limit: '8',
    depth: '2',
    locale: DEFAULT_LOCALE,
    sort: '-createdAt',
  });

  const postParams = new URLSearchParams({
    'where[title][like]': query,
    'where[_status][equals]': 'published',
    limit: '4',
    depth: '1',
    locale: DEFAULT_LOCALE,
    sort: '-publishedOn',
  });

  const [productsResult, postsResult] = await Promise.all([
    fetchJSON(`${API_URL}/products?${productParams}`),
    fetchJSON(`${API_URL}/posts?${postParams}`),
  ]);

  return NextResponse.json({
    products: productsResult?.docs ?? [],
    posts: postsResult?.docs ?? [],
  });
}
