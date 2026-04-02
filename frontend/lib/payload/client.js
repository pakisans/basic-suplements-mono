import { INTERNAL_PAYLOAD_URL, DEFAULT_LOCALE, REVALIDATE } from '@/constants';

const API_URL = `${INTERNAL_PAYLOAD_URL}/api`;

// During `next build`, the backend (app1) may not be running.
// Without a timeout, fetch() hangs until the OS TCP timeout (~60-120 s),
// which breaks CI/Docker builds. Fail fast so pages render with empty data.
const FETCH_TIMEOUT_MS =
  process.env.NEXT_PHASE === 'phase-production-build' ? 5_000 : 10_000;

function createTimeoutSignal() {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

function buildQuery(params) {
  const parts = [];

  function flatten(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (value === null || value === undefined) continue;

      if (typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, fullKey);
      } else if (Array.isArray(value)) {
        parts.push(
          `${fullKey}=${encodeURIComponent(value.map((v) => String(v)).join(','))}`,
        );
      } else {
        parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
      }
    }
  }

  flatten(params);
  return parts.join('&');
}

export async function payloadFetch(endpoint, options = {}) {
  const { locale = DEFAULT_LOCALE, depth = 1, revalidate, tags } = options;
  const query = buildQuery({ locale, depth });
  const url = `${API_URL}${endpoint}?${query}`;

  const { signal, clear } = createTimeoutSignal();
  let res;
  try {
    res = await fetch(url, {
      signal,
      next: {
        revalidate: revalidate ?? REVALIDATE.pages,
        tags: tags ?? [],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    // Backend unavailable or timed out (e.g. during Docker build) — return null gracefully
    return null;
  } finally {
    clear();
  }

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(
      `Payload API error: ${res.status} ${res.statusText} — ${url}`,
    );
  }

  return res.json();
}

export async function payloadQuery(collection, options = {}) {
  const {
    locale = DEFAULT_LOCALE,
    depth = 1,
    revalidate,
    tags,
    where,
    sort,
    limit = 12,
    page = 1,
  } = options;

  const params = { locale, depth, limit, page };
  if (where) params.where = where;
  if (sort) params.sort = sort;

  const query = buildQuery(params);
  const url = `${API_URL}/${collection}?${query}`;

  const emptyResult = {
    docs: [],
    totalDocs: 0,
    limit,
    page,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };

  const { signal, clear } = createTimeoutSignal();
  let res;
  try {
    res = await fetch(url, {
      signal,
      next: {
        revalidate: revalidate ?? REVALIDATE.products,
        tags: tags ?? [],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    // Backend unavailable or timed out (e.g. during Docker build) — return empty gracefully
    return emptyResult;
  } finally {
    clear();
  }

  if (!res.ok) {
    if (res.status === 404) return emptyResult;

    const errorDetails = await readPayloadError(res);
    throw new Error(
      `Payload API error: ${res.status}${errorDetails ? ` (${errorDetails})` : ''} — ${url}`,
    );
  }

  return res.json();
}

async function readPayloadError(res) {
  const contentType = res.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const data = await res.json();

      if (typeof data === 'string') return data;
      if (data && typeof data === 'object') {
        if (typeof data.message === 'string' && data.message.trim())
          return data.message;
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          return data.errors
            .map((error) => {
              if (typeof error === 'string') return error;
              if (error && typeof error.message === 'string')
                return error.message;
              return JSON.stringify(error);
            })
            .join('; ');
        }

        return JSON.stringify(data);
      }
    }

    const text = await res.text();
    return text.trim();
  } catch {
    return '';
  }
}

export async function payloadGlobal(slug, options = {}) {
  return payloadFetch(`/globals/${slug}`, {
    ...options,
    revalidate: options.revalidate ?? REVALIDATE.globals,
  });
}

export async function payloadFindBySlug(collection, slug, options = {}) {
  const result = await payloadQuery(collection, {
    ...options,
    where: {
      slug: { equals: slug },
      ...options.where,
    },
    limit: 1,
  });

  return result.docs[0] ?? null;
}
