'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';

export function MobileMenu({ navItems = [] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative z-[70]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Otvori meni"
        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[11px] font-medium tracking-[0.22em] text-white uppercase transition-colors hover:border-white/30 hover:bg-white/[0.06]"
      >
        <span>Meni</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M4 6h12M4 10h12M4 14h12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[120] transition-all duration-300 ease-out lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Zatvori meni"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute inset-x-4 top-4 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#111111_0%,#050505_100%)] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)] transition-all duration-300 ease-out ${
            open ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-4 scale-[0.98] opacity-0'
          }`}
        >
          <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <p className="text-[10px] font-medium tracking-[0.24em] text-zinc-500 uppercase">
                Navigacija
              </p>
              <p className="mt-1 text-base font-semibold text-white">Meni</p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              aria-label="Zatvori meni"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6 18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.id ?? index}
                href={resolveLink(item.link)}
                onClick={() => setOpen(false)}
                className="rounded-full border border-transparent bg-white/[0.03] px-4 py-3 text-xs font-medium tracking-[0.18em] text-zinc-200 uppercase transition-colors hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              >
                {item.link?.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-white/8 pt-4">
            <p className="text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase">
              Quick Links
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/pretraga"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/8 px-3 py-2.5 text-center text-[11px] font-medium tracking-[0.16em] text-zinc-300 uppercase transition-colors hover:border-white/15 hover:text-white"
              >
                Pretraga
              </Link>
              <Link
                href="/nalog"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/8 px-3 py-2.5 text-center text-[11px] font-medium tracking-[0.16em] text-zinc-300 uppercase transition-colors hover:border-white/15 hover:text-white"
              >
                Nalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
