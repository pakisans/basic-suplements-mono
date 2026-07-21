import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { buildProductPath } from '@/services/products';
import { CURRENCY } from '@/constants';

function fromPrice(product) {
  const value = product?.salePrice ?? product?.price;
  if (value === undefined || value === null) return null;
  return `${new Intl.NumberFormat('sr-RS').format(value)} ${CURRENCY.symbol}`;
}

export function ProductSpotlightBlock({ block }) {
  const product =
    block?.product && typeof block.product === 'object' ? block.product : null;
  if (!product) return null;

  const image = product.gallery?.[0]?.image;
  const href = buildProductPath(product);
  const price = fromPrice(product);
  const imageLeft = block.imageSide === 'left';
  const stat = block.stat?.value ? block.stat : null;

  return (
    <section
      aria-label={product.title}
      className="relative border-t border-white/[0.06] bg-black py-24 md:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Image */}
          <Link
            href={href}
            aria-label={product.title}
            className={`group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-100 to-zinc-300 p-8 md:aspect-[4/3] ${
              imageLeft ? 'md:order-1' : 'md:order-2'
            }`}
          >
            {image && (
              <PayloadImage
                media={image}
                fill
                className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </Link>

          {/* Copy */}
          <div className={imageLeft ? 'md:order-2' : 'md:order-1'}>
            {block.eyebrow && (
              <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                {block.eyebrow}
              </p>
            )}

            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              {product.title}
            </h2>

            {block.summary && (
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-zinc-400 md:text-base">
                {block.summary}
              </p>
            )}

            {stat && (
              <div className="mt-8 inline-flex items-baseline gap-3 rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-4">
                <span className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  {stat.value}
                </span>
                {stat.label && (
                  <span className="text-[13px] leading-tight text-zinc-400">
                    {stat.label}
                  </span>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                {block.ctaLabel || 'Shop now'}
                <span aria-hidden="true">→</span>
              </Link>
              {price && (
                <span className="text-sm text-zinc-500">
                  Od <span className="font-semibold text-zinc-300">{price}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
