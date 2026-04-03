'use client';

import { useState, useRef, useEffect, useId } from 'react';

export function Select({
  options = [],
  value,
  onChange,
  label,
  id,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const autoId = useId();
  const triggerId = id ?? autoId;

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (
      !open &&
      (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')
    ) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items =
          listRef.current?.querySelectorAll('[role="option"]') ?? [];
        const arr = Array.from(items);
        const idx = arr.indexOf(document.activeElement);
        const next =
          e.key === 'ArrowDown'
            ? Math.min(idx + 1, arr.length - 1)
            : Math.max(idx - 1, 0);
        arr[next]?.focus();
      }
      if (e.key === 'Tab') setOpen(false);
    }
  }

  function select(optValue) {
    onChange?.(optValue);
    setOpen(false);
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center gap-2 ${className}`}
      onKeyDown={onKeyDown}
    >
      {label && (
        <label
          htmlFor={triggerId}
          className="text-xs font-medium tracking-widest text-zinc-600 uppercase whitespace-nowrap select-none cursor-pointer"
        >
          {label}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`
          relative flex items-center gap-2.5 border px-3 py-2 text-xs font-medium
          transition-colors duration-150 whitespace-nowrap select-none
          focus:outline-none
          ${
            open
              ? 'border-zinc-600 bg-zinc-950 text-white'
              : 'border-zinc-800 bg-black text-zinc-300 hover:border-zinc-600 hover:text-white'
          }
        `}
      >
        <span>{selected?.label ?? '—'}</span>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`h-2.5 w-2.5 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180 text-zinc-300' : ''}`}
        >
          <path d="M1 4l5 5 5-5" />
        </svg>
      </button>

      <div
        className={`
          absolute top-full left-0 z-50 mt-1 min-w-full overflow-hidden
          border border-zinc-800 bg-zinc-950
          transition-all duration-150 origin-top
          ${open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}
        `}
        style={{ transformOrigin: 'top' }}
      >
        <ul ref={listRef} role="listbox" aria-label={label} className="py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={open ? 0 : -1}
                onClick={() => select(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select(opt.value);
                  }
                }}
                className={`
                  flex items-center justify-between gap-4 px-3 py-2 text-xs
                  cursor-pointer transition-colors duration-100 focus:outline-none
                  ${
                    isSelected
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white'
                  }
                `}
              >
                <span className="whitespace-nowrap">{opt.label}</span>
                {isSelected && (
                  <svg
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className="h-2.5 w-2.5 shrink-0 text-zinc-400"
                  >
                    <path
                      d="M1.5 6.5 4.5 9.5 10.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
