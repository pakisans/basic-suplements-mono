import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';

export function FeatureShowcaseBlock({ block }) {
  const main = block?.mainImage;
  if (!main) return null;

  const gallery = (block.gallery ?? [])
    .map((g) => g?.image)
    .filter(Boolean)
    .slice(0, 4);
  const imageLeft = block.imageSide === 'left';
  const cta = block.cta || {};

  return (
    <section
      aria-label={block.heading || 'Feature'}
      className="relative border-t border-white/[0.06] bg-black py-24 md:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Copy */}
          <div className={imageLeft ? 'md:order-2' : 'md:order-1'}>
            {block.eyebrow && (
              <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-white">
                {block.eyebrow}
              </span>
            )}

            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              {block.heading}
            </h2>

            {block.body && (
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-zinc-400 md:text-base">
                {block.body}
              </p>
            )}

            {cta.label && (
              <div className="mt-10">
                <Link
                  href={cta.url || '/products'}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  {cta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Images */}
          <div className={imageLeft ? 'md:order-1' : 'md:order-2'}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-100 to-zinc-300">
              <PayloadImage
                media={main}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {gallery.slice(0, 3).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-300"
                  >
                    <PayloadImage
                      media={img}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
