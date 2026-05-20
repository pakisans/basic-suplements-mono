'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { resolveLink } from '@/components/ui/Button';

function NavItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasDropdown = item.subItems?.length > 0;

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, [open]);

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

      {/* Dropdown panel */}
      <div
        className={`absolute left-1/2 top-full z-[60] min-w-[200px] -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        {/* Arrow */}
        <div className="absolute left-1/2 top-[11px] h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-zinc-800 bg-zinc-950" />

        <ul className="relative overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 py-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]">
          {item.subItems.map((sub, i) => (
            <li key={sub.id ?? i}>
              <Link
                href={resolveLink(sub.link)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-zinc-500 uppercase transition-colors duration-100 hover:bg-white/[0.03] hover:text-white"
                target={sub.link?.newTab ? '_blank' : undefined}
              >
                <span className="h-px w-3 shrink-0 bg-zinc-800" aria-hidden="true" />
                {sub.link?.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Navigation({ navItems = [] }) {
  return (
    <nav className="flex min-w-0 items-center justify-center gap-5 xl:gap-7" aria-label="Main navigation">
      {navItems.map((item, index) => (
        <NavItem key={item.id ?? index} item={item} index={index} />
      ))}
    </nav>
  );
}
