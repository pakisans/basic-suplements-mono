import Link from 'next/link';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { CartTrigger } from '@/components/cart/CartTrigger';
import { ROUTES, SITE_NAME } from '@/constants';

function isExternalLink(href) {
  return /^https?:\/\//i.test(href);
}

export function Header({ header }) {
  const navItems = header?.navItems ?? [];
  const promo = header?.promoBanner;
  const siteName = header?.siteName || SITE_NAME;
  const logo = header?.logo;
  const promoHref = typeof promo?.link === 'string' ? promo.link.trim() : '';
  const hasPromoLink = Boolean(promoHref);
  const promoIsExternal = hasPromoLink ? isExternalLink(promoHref) : false;

  return (
    <>
      {promo?.enabled && promo.text && (
        <div className="border-b border-zinc-800/80 bg-linear-to-r from-black via-zinc-950 to-black">
          {hasPromoLink ? (
            <Link
              href={promoHref}
              className="group relative block overflow-hidden px-4 py-3"
              {...(promoIsExternal
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)] opacity-70" />
              <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center">
                <span className="hidden h-px w-10 bg-white/12 sm:block" />
                <span className="text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase">
                  Promo
                </span>
                <span className="text-xs font-medium tracking-[0.18em] text-zinc-200 uppercase transition-colors group-hover:text-white">
                  {promo.text}
                </span>
                <span className="inline-flex items-center text-[11px] font-medium tracking-[0.22em] text-zinc-500 uppercase transition-colors group-hover:text-zinc-300">
                  Saznaj Više
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="ml-2 h-3.5 w-3.5 opacity-80 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="m10 6 4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="hidden h-px w-10 bg-white/12 sm:block" />
              </div>
            </Link>
          ) : (
            <div className="px-4 py-3 text-center">
              <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
                <span className="hidden h-px w-10 bg-white/12 sm:block" />
                <span className="text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase">
                  Promo
                </span>
                <span className="text-xs font-medium tracking-[0.18em] text-zinc-200 uppercase">
                  {promo.text}
                </span>
                <span className="hidden h-px w-10 bg-white/12 sm:block" />
              </div>
            </div>
          )}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto grid h-[78px] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-[84px] sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center transition-opacity hover:opacity-85">
            {logo ? (
              <PayloadImage
                media={logo}
                alt={siteName}
                width={320}
                height={110}
                priority
                className="h-10 w-auto max-w-[170px] object-contain sm:h-11 sm:max-w-[190px] lg:h-14 lg:max-w-[230px]"
                sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 224px"
              />
            ) : (
              <span className="truncate text-xl font-bold tracking-[0.2em] text-white uppercase sm:text-2xl">
                {siteName}
              </span>
            )}
          </Link>

          <div className="hidden min-w-0 items-center justify-center lg:flex">
            <Navigation navItems={navItems} />
          </div>

          <div className="hidden items-center justify-end gap-1 lg:flex">
            <Link
              href={ROUTES.search}
              className="p-2 text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
            >
              Pretraga
            </Link>
            <Link
              href={ROUTES.account}
              className="p-2 text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
            >
              Nalog
            </Link>
            <CartTrigger />
          </div>

          <div className="flex items-center justify-end gap-2 lg:hidden">
            <CartTrigger mobile />
            <MobileMenu navItems={navItems} />
          </div>
        </div>
      </header>
    </>
  );
}
