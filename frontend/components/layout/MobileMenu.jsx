'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

function MobileNavItem({ item, onClose }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubItems = item.subItems?.length > 0;

  if (!hasSubItems) {
    return (
      <Link
        href={resolveLink(item.link)}
        onClick={onClose}
        className="flex items-center rounded-sm border border-transparent bg-white/[0.03] px-4 py-3 text-xs font-medium tracking-[0.18em] text-zinc-200 uppercase transition-colors hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
      >
        {item.link?.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between rounded-sm border border-transparent bg-white/[0.03] px-4 py-3 text-xs font-medium tracking-[0.18em] text-zinc-200 uppercase transition-colors hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
        aria-expanded={expanded}
      >
        <span>{item.link?.label}</span>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-1 overflow-hidden border border-zinc-800/50 bg-zinc-950/60">
          {/* "All products" header link */}
          <Link
            href={resolveLink(item.link)}
            onClick={onClose}
            className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] text-zinc-300 uppercase transition-colors hover:text-white"
          >
            <span>All {item.link?.label}</span>
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
              <path d="M3 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="grid grid-cols-2 gap-px bg-zinc-800/20 p-px">
            {item.subItems.slice(1).map((sub, i) => (
              <Link
                key={sub.id ?? i}
                href={resolveLink(sub.link)}
                onClick={onClose}
                className="bg-zinc-950/80 px-4 py-3 text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
              >
                {sub.link?.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileMenu({ navItems = [], topBar = [] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  function close() { setOpen(false); }

  return (
    <div ref={rootRef} className="relative z-[70]">
      {/* Hamburger trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open menu"
        className="inline-flex items-center gap-2 rounded-sm border border-white/12 bg-white/[0.03] px-3 py-2 text-[11px] font-medium tracking-[0.22em] text-white uppercase transition-colors hover:border-white/25 hover:bg-white/[0.06]"
      >
        <span>Menu</span>
        <svg viewBox="0 0 20 20" fill="none" className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} aria-hidden="true">
          <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {/* Overlay + panel */}
      <div
        className={`fixed inset-0 z-[120] transition-all duration-300 ease-out lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Panel */}
        <div
          className={`absolute inset-x-3 top-3 overflow-y-auto rounded-sm border border-white/8 bg-[linear-gradient(180deg,#111111_0%,#060606_100%)] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,1)] transition-all duration-300 ease-out ${
            open ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-4 scale-[0.98] opacity-0'
          }`}
          style={{ maxHeight: 'calc(100dvh - 24px)' }}
        >
          {/* Panel header */}
          <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <p className="text-[10px] font-medium tracking-[0.28em] text-zinc-600 uppercase">Navigation</p>
              <p className="mt-1 text-base font-semibold text-white">Menu</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Main nav items */}
          <div className="flex flex-col gap-1.5">
            {navItems.map((item, index) => (
              <MobileNavItem key={item.id ?? index} item={item} onClose={close} />
            ))}
          </div>

          {/* Top bar links */}
          {topBar.length > 0 && (
            <div className="mt-4 border-t border-white/8 pt-4">
              <p className="mb-3 text-[10px] font-medium tracking-[0.28em] text-zinc-600 uppercase">More</p>
              <div className="grid grid-cols-2 gap-1.5">
                {topBar.map((item, i) => (
                  <Link
                    key={item.id ?? i}
                    href={resolveLink(item.link)}
                    onClick={close}
                    className="rounded-sm border border-white/8 px-3 py-2.5 text-center text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase transition-colors hover:border-white/15 hover:text-white"
                    target={item.link?.newTab ? '_blank' : undefined}
                  >
                    {item.link?.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="mt-4 border-t border-white/8 pt-4">
            <p className="mb-3 text-[10px] font-medium tracking-[0.24em] text-zinc-600 uppercase">Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={ROUTES.search}
                onClick={close}
                className="rounded-sm border border-white/8 px-3 py-2.5 text-center text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase transition-colors hover:border-white/15 hover:text-white"
              >
                Search
              </Link>
              <Link
                href={ROUTES.account}
                onClick={close}
                className="rounded-sm border border-white/8 px-3 py-2.5 text-center text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase transition-colors hover:border-white/15 hover:text-white"
              >
                Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
