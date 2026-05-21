'use client';

import { useEffect, useRef, useState } from 'react';
import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

export function CallToActionBlock({ block }) {
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Call to action"
      className="relative overflow-hidden bg-zinc-950 py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />

      <div className="container relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* decorative row — lines expand outward */}
        <div
          className="mb-12 flex items-center justify-center gap-3"
          aria-hidden="true"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 0ms' }}
        >
          <span
            className="h-px bg-white/10"
            style={{ width: inView ? 80 : 0, transition: 'width 0.7s ease 100ms' }}
          />
          <span
            className="h-1 w-1 rotate-45 bg-white/20"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)', transition: 'opacity 0.3s ease 250ms, transform 0.3s ease 250ms' }}
          />
          <span
            className="h-1.5 w-1.5 rotate-45 bg-white/30"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)', transition: 'opacity 0.3s ease 320ms, transform 0.3s ease 320ms' }}
          />
          <span
            className="h-1 w-1 rotate-45 bg-white/20"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)', transition: 'opacity 0.3s ease 250ms, transform 0.3s ease 250ms' }}
          />
          <span
            className="h-px bg-white/10"
            style={{ width: inView ? 80 : 0, transition: 'width 0.7s ease 100ms' }}
          />
        </div>

        {block.richText && (
          <div
            className="[&_h1]:mb-5 [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:mb-5 [&_h2]:text-5xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white md:[&_h1]:text-6xl md:[&_h2]:text-6xl [&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_p:last-child]:mb-0 [&_strong]:text-white"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 0.7s ease 200ms, transform 0.7s ease 200ms',
            }}
          >
            <RichText content={block.richText} />
          </div>
        )}

        {block.links?.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {block.links.map((item, index) => (
              <div
                key={index}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.6s ease ${420 + index * 100}ms, transform 0.6s ease ${420 + index * 100}ms`,
                }}
              >
                <LinkButton link={item.link} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
