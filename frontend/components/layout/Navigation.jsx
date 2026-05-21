'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';

function SimpleDropdown({ subItems, onClose }) {
  return (
    <ul className="relative overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 py-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]">
      {subItems.map((sub, i) => (
        <li key={sub.id ?? i}>
          <Link
            href={resolveLink(sub.link)}
            onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-zinc-500 uppercase transition-colors duration-100 hover:bg-white/[0.03] hover:text-white"
            target={sub.link?.newTab ? '_blank' : undefined}
          >
            <span className="h-px w-3 shrink-0 bg-zinc-800" aria-hidden="true" />
            {sub.link?.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaDropdown({ item, onClose }) {
  const href = resolveLink(item.link);
  const subItems = item.subItems ?? [];
  const [first, ...rest] = subItems;

  return (
    <div className="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_-10px_rgba(0,0,0,0.9)]" style={{ width: 480 }}>
      {/* Header */}
      <div className="border-b border-zinc-800/60 px-5 py-4">
        <p className="text-[9px] font-semibold tracking-[0.4em] text-zinc-600 uppercase">Browse</p>
        <Link
          href={href}
          onClick={onClose}
          className="group mt-1 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-white transition-opacity hover:opacity-70"
        >
          {item.link?.label}
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M3 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Grid of sub-items */}
      <div className="grid grid-cols-2 gap-px bg-zinc-800/30 p-px">
        {subItems.map((sub, i) => {
          const isFirst = i === 0;
          return (
            <Link
              key={sub.id ?? i}
              href={resolveLink(sub.link)}
              onClick={onClose}
              className={`group flex items-center gap-3 bg-zinc-950 px-5 py-3.5 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-100 hover:bg-white/[0.04] ${
                isFirst ? 'text-zinc-200 hover:text-white' : 'text-zinc-500 hover:text-zinc-200'
              }`}
              target={sub.link?.newTab ? '_blank' : undefined}
            >
              <span className={`h-px w-3 shrink-0 transition-all duration-150 group-hover:w-4 ${isFirst ? 'bg-white/40' : 'bg-zinc-800'}`} aria-hidden="true" />
              {sub.link?.label}
            </Link>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-zinc-800/60 px-5 py-3">
        <Link
          href={href}
          onClick={onClose}
          className="group flex items-center justify-between text-[10px] font-semibold tracking-[0.28em] text-zinc-600 uppercase transition-colors hover:text-white"
        >
          <span>View all products</span>
          <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M3 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function NavItem({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasDropdown = item.subItems?.length > 0;
  const isMega = (item.subItems?.length ?? 0) > 3;

  function close() { setOpen(false); }

  if (!hasDropdown) {
    return (
      <Link
        href={resolveLink(item.link)}
        className="shrink-0 whitespace-nowrap text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase transition-colors duration-150 hover:text-white"
        target={item.link?.newTab ? '_blank' : undefined}
      >
        {item.link?.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase transition-colors duration-150 hover:text-white"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.link?.label}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={`h-2.5 w-2.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute top-full z-[60] pt-4 transition-all duration-200 ${
          isMega ? 'left-1/2 -translate-x-1/2' : 'left-1/2 min-w-[200px] -translate-x-1/2'
        } ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        {/* Arrow */}
        <div className="absolute left-1/2 top-[14px] h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-zinc-800 bg-zinc-950" />

        {isMega ? (
          <MegaDropdown item={item} onClose={close} />
        ) : (
          <SimpleDropdown subItems={item.subItems} onClose={close} />
        )}
      </div>
    </div>
  );
}

export function Navigation({ navItems = [] }) {
  return (
    <nav className="flex min-w-0 items-center justify-center gap-5 xl:gap-7" aria-label="Main navigation">
      {navItems.map((item, index) => (
        <NavItem key={item.id ?? index} item={item} />
      ))}
    </nav>
  );
}
