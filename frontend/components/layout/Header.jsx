'use client';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { CartTrigger } from '@/components/cart/CartTrigger';
import { ROUTES, SITE_NAME } from '@/constants';
import { useCatalogMode } from '@/components/catalog/CatalogModeProvider';
import { resolveLink } from '@/components/ui/Button';

function isExternal(href) {
  return /^https?:\/\//i.test(href ?? '');
}

export function Header({ header }) {
  const { isCatalogOnly } = useCatalogMode();
  const navItems = header?.navItems ?? [];
  const topBar = header?.topBar ?? [];
  const promo = header?.promoBanner;
  const siteName = header?.siteName || SITE_NAME;
  const logo = header?.logo;
  const promoHref =
    typeof promo?.link?.url === 'string' ? promo.link.url.trim() : '';

  return (
    <div className="sticky top-0 z-50">
      {/* ── Promo banner ── */}

      {promo?.enabled && promo.text && (
        <div className="border-b border-zinc-800/60 bg-gradient-to-r from-black via-zinc-950 to-black p-4">
          {promoHref ? (
            <Link
              href={promoHref}
              className="group relative block overflow-hidden px-4 py-2.5"
              {...(isExternal(promoHref)
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
              <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center">
                <span className="hidden h-px w-8 shrink-0 bg-white/10 sm:block" />
                <span className="text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
                  Offer
                </span>
                <span className="text-[11px] font-medium tracking-[0.15em] text-zinc-300 uppercase transition-colors group-hover:text-white">
                  {promo.text}
                </span>
                <span className="hidden items-center gap-1.5 text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase transition-colors group-hover:text-zinc-300 sm:flex">
                  {promo.link?.label || 'Shop Now'}
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h9M8 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="hidden h-px w-8 shrink-0 bg-white/10 sm:block" />
              </div>
            </Link>
          ) : (
            <div className="px-4 py-2.5 text-center">
              <span className="text-[11px] font-medium tracking-[0.15em] text-zinc-400 uppercase">
                {promo.text}
              </span>
            </div>
          )}
        </div>
      )}
      {/* ── Top utility bar ── */}
      {topBar.length > 0 && (
        <div className="hidden border-b border-zinc-800/50 bg-zinc-950 lg:block">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-end gap-0 px-8">
            {topBar.map((item, i) => {
              const href = resolveLink(item.link);
              return (
                <span key={item.id ?? i} className="flex items-center">
                  {i > 0 && (
                    <span
                      className="mx-3 h-3 w-px bg-zinc-800"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={href}
                    className="whitespace-nowrap text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase transition-colors duration-150 hover:text-zinc-200"
                    {...(isExternal(href)
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {})}
                  >
                    {item.link?.label}
                  </Link>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main header ── */}
      <header className="border-b border-zinc-800/80 bg-black/96 backdrop-blur-md">
        <div className="container mx-auto grid h-[72px] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-[80px] sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center transition-opacity hover:opacity-80"
          >
            {logo ? (
              <PayloadImage
                media={logo}
                alt={siteName}
                width={320}
                height={110}
                priority
                className="h-9 w-auto max-w-[160px] object-contain sm:h-10 sm:max-w-[180px] lg:h-12 lg:max-w-[220px]"
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 220px"
              />
            ) : (
              <span className="truncate text-lg font-bold tracking-[0.22em] text-white uppercase sm:text-xl lg:text-2xl">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden min-w-0 items-center justify-center lg:flex">
            <Navigation navItems={navItems} />
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center justify-end gap-0.5 lg:flex">
            <Link
              href={ROUTES.search}
              className="inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-[11px] font-medium tracking-[0.18em] text-zinc-500 uppercase transition-colors hover:text-white"
              aria-label="Search"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="m13.5 13.5 3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="hidden xl:inline">Search</span>
            </Link>
            {!isCatalogOnly && (
              <Link
                href={ROUTES.account}
                className="inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-[11px] font-medium tracking-[0.18em] text-zinc-500 uppercase transition-colors hover:text-white"
                aria-label="Account"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <circle
                    cx="10"
                    cy="7"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="hidden xl:inline">Account</span>
              </Link>
            )}
            {!isCatalogOnly && <CartTrigger />}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center justify-end gap-1.5 lg:hidden">
            {!isCatalogOnly && <CartTrigger mobile />}
            <MobileMenu navItems={navItems} />
          </div>
        </div>
      </header>
    </div>
  );
}
