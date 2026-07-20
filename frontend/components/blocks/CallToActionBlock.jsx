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
      className="relative bg-black border-t border-white/[0.06] py-28 md:py-40"
    >

      <div className="container relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">

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

    </section>
  );
}
