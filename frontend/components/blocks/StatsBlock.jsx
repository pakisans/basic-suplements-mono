'use client';

import { useEffect, useRef, useState } from 'react';

function parseValue(raw) {
  if (!raw)
    return {
      prefix: '',
      number: null,
      suffix: raw ?? '',
      decimals: 0,
      formatted: false,
    };

  const prefixMatch = raw.match(/^([^0-9]*)(.*)$/);
  const prefix = prefixMatch?.[1] ?? '';
  const rest = prefixMatch?.[2] ?? raw;

  const numMatch = rest.match(/^([\d,]+\.?\d*)(.*)/);
  if (!numMatch)
    return {
      prefix,
      number: null,
      suffix: rest,
      decimals: 0,
      formatted: false,
    };

  const numStr = numMatch[1];
  const suffix = numMatch[2] ?? '';
  const formatted = numStr.includes(',');
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  const number = parseFloat(numStr.replace(/,/g, ''));

  return { prefix, number, suffix, decimals, formatted };
}

function formatNumber(value, decimals, formatted) {
  if (decimals > 0) {
    const fixed = value.toFixed(decimals);
    if (!formatted) return fixed;
    const [int, dec] = fixed.split('.');
    return parseInt(int, 10).toLocaleString('en-US') + '.' + dec;
  }
  const int = Math.floor(value);
  return formatted ? int.toLocaleString('en-US') : String(int);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function AnimatedStat({ value, label, delay = 0, inView }) {
  const parsed = parseValue(value);
  const initialDisplay =
    parsed.number !== null ? `${parsed.prefix}0${parsed.suffix}` : value;

  const [display, setDisplay] = useState(initialDisplay);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 1800;

  useEffect(() => {
    if (!inView || parsed.number === null) return;

    const timeout = setTimeout(() => {
      startRef.current = null;

      function tick(ts) {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        const eased = easeOutExpo(t);
        const current = eased * parsed.number;

        setDisplay(
          `${parsed.prefix}${formatNumber(current, parsed.decimals, parsed.formatted)}${parsed.suffix}`,
        );
        setProgress(eased);

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(
            `${parsed.prefix}${formatNumber(parsed.number, parsed.decimals, parsed.formatted)}${parsed.suffix}`,
          );
          setProgress(1);
          setDone(true);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, delay]);

  return (
    <div className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-zinc-950 px-6 py-12 text-center transition-colors duration-500 hover:bg-zinc-900/50">
      {/* fill bar animating upward from bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-white/[0.03] to-transparent transition-none"
        style={{ height: `${progress * 100}%` }}
      />

      {/* top accent line filling left→right */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-zinc-800">
        <div
          className="h-full bg-white/30 transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <dd
        className="relative text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(14px)',
          transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
          fontVariantNumeric: 'tabular-nums',
          textShadow: done ? '0 0 40px rgba(255,255,255,0.15)' : 'none',
          transitionProperty: 'opacity, transform, text-shadow',
        }}
      >
        {display}
      </dd>

      <dt
        className="relative text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ease ${delay + 250}ms`,
        }}
      >
        {label}
      </dt>
    </div>
  );
}

export function StatsBlock({ block }) {
  const items = block.items ?? [];
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Key statistics"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {block.heading && (
          <div
            className="mb-14 text-center"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
              {block?.label ?? 'By the numbers'}
            </p>
            <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
              {block.heading}
            </h2>
            <div
              className="mx-auto mt-4 h-px bg-white/20"
              style={{
                width: inView ? 48 : 0,
                transition: 'width 0.8s ease 0.3s',
              }}
            />
          </div>
        )}

        <dl
          className="grid grid-cols-2 gap-px bg-white/5 ring-1 ring-white/8 md:grid-cols-4"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          {items.map((item, index) => (
            <AnimatedStat
              key={item.id ?? index}
              value={item.value}
              label={item.label}
              delay={index * 130}
              inView={inView}
            />
          ))}
        </dl>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
