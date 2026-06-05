'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCatalogMode } from './CatalogModeProvider';
import { getMarkets } from '@/services/markets';

function detectSuggestedMarket(markets, countryCode) {
  if (!countryCode || !markets.length) return null;
  const up = countryCode.toUpperCase();
  return (
    markets.find((m) =>
      m.countryCode
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .includes(up),
    ) ?? null
  );
}

export function CountryGate() {
  const { gateVisible, dismiss } = useCatalogMode();
  const [markets, setMarkets] = useState([]);
  const [suggested, setSuggested] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gateVisible) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [gateVisible]);

  useEffect(() => {
    if (!gateVisible) return;

    async function load() {
      const [fetchedMarkets, geoData] = await Promise.allSettled([
        getMarkets(),
        fetch('https://ipapi.co/json/').then((r) => r.json()),
      ]);

      const mList =
        fetchedMarkets.status === 'fulfilled' ? fetchedMarkets.value : [];
      const countryCode =
        geoData.status === 'fulfilled' ? geoData.value?.country_code : null;

      const s = detectSuggestedMarket(mList, countryCode);
      setMarkets(mList);
      setSuggested(s);
      setOthers(s ? mList.filter((m) => m.id !== s.id) : mList);
      setLoading(false);
    }

    load();
  }, [gateVisible]);

  if (!gateVisible) return null;

  function goTo(market) {
    window.location.href = market.url;
  }

  return (
    <div className="bs-overlay-in fixed inset-0 z-9999 flex items-center justify-center bg-black/95">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(255,255,255,0.04),transparent)]" />

      {/* X dismiss */}
      <button
        onClick={dismiss}
        aria-label="Browse without selecting country"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4"
        >
          <path d="M3 3 13 13M13 3 3 13" strokeLinecap="round" />
        </svg>
      </button>

      <div className="bs-card-in relative z-10 flex w-full max-w-lg flex-col items-center px-6 py-14">
        <div className="bs-logo-wrap relative mb-8 w-56 overflow-hidden sm:w-80 lg:w-96">
          <Image
            src="/logo.png"
            alt="Basic Supplements"
            width={1536}
            height={1024}
            priority
            className="bs-logo-reveal h-auto w-full select-none"
          />
          <span className="bs-logo-shine pointer-events-none absolute inset-0" />
        </div>
        <h1
          className="bs-rise-in mb-2 text-center text-2xl font-bold tracking-tight text-white"
          style={{ animationDelay: '0.34s' }}
        >
          Select your market
        </h1>
        <p
          className="bs-rise-in mb-10 text-center text-sm text-zinc-500"
          style={{ animationDelay: '0.42s' }}
        >
          You&apos;ll be redirected to your local distributor.
        </p>

        {loading ? (
          <div className="w-full space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse bg-zinc-900" />
            ))}
          </div>
        ) : (
          <>
            {suggested && (
              <>
                <p className="mb-2 text-[10px] font-medium tracking-[0.3em] text-zinc-600 uppercase">
                  Suggested for you
                </p>
                <button
                  onClick={() => goTo(suggested)}
                  className="mb-5 flex w-full items-center justify-between border border-white bg-white px-6 py-4 font-semibold text-black transition-colors hover:bg-zinc-100"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{suggested.flag}</span>
                    <span className="tracking-wide">{suggested.label}</span>
                  </span>
                  <span className="text-xs font-normal text-zinc-400">
                    Shop →
                  </span>
                </button>
                {others.length > 0 && (
                  <p className="mb-2 text-[10px] font-medium tracking-[0.3em] text-zinc-600 uppercase">
                    Other regions
                  </p>
                )}
              </>
            )}

            <div className="w-full space-y-2">
              {(suggested ? others : markets).map((m) => (
                <button
                  key={m.id}
                  onClick={() => goTo(m)}
                  className="flex w-full items-center gap-3 border border-zinc-800 px-6 py-3 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  <span className="text-xl">{m.flag}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {!markets.length && (
              <p className="text-sm text-zinc-500">
                No markets configured yet.
              </p>
            )}
          </>
        )}

        <button
          onClick={dismiss}
          className="mt-10 text-[11px] tracking-widest text-zinc-700 uppercase transition-colors hover:text-zinc-400"
        >
          Browse catalog without purchasing
        </button>
      </div>
    </div>
  );
}
