import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';

/**
 * Editorial hero — a two-column split with a large headline + CTA on the left
 * and a large rounded product/lifestyle image on the right.
 *
 * Data shape is unchanged: `block.panels[{ image, eyebrow, title, url }]`.
 * The first panel drives the primary editorial hero. If a second panel exists,
 * its `url`/`title` become the secondary underlined text link.
 */
export function SplitHeroBlock({ block }) {
  const panels = block?.panels ?? [];
  const primary = panels[0];
  const secondary = panels[1];
  if (!primary) return null;

  const eyebrow = primary.eyebrow ?? '';
  const title = primary.title ?? '';
  const primaryHref = primary.url || '/products';
  const secondaryHref = secondary?.url || null;
  const secondaryLabel = secondary?.title || 'Explore all';

  return (
    <section
      aria-label={title || 'Hero'}
      className="relative overflow-hidden bg-black"
    >
      <div className="container mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 md:pt-24 md:pb-20 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Copy */}
          <div className="max-w-xl">
            {eyebrow && (
              <p className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                {eyebrow}
              </p>
            )}

            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-zinc-400 md:text-base">
              Premium formulations with carefully selected, clinically-backed ingredients — for results you can count on.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                Shop now
                <span aria-hidden="true">→</span>
              </Link>

              {secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="text-[13px] font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first md:order-last">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-zinc-900 sm:aspect-[5/4] md:aspect-[4/5]">
              {primary.image && (
                <PayloadImage
                  media={primary.image}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
