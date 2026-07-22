import Link from 'next/link';
import { FeaturedProductCard } from '@/components/product/FeaturedProductCard';

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
  </svg>
);

export function ThreeItemGridBlock({ block }) {
  const products = (block.products ?? []).slice(0, 3);
  if (!products.length) return null;

  return (
    <section
      aria-label="Top picks"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
              Featured
            </p>
            <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
              Top Picks
            </h2>
            <div className="mt-4 h-px w-12 bg-white/20" />
          </div>
          <Link
            href="/products"
            className="group hidden shrink-0 items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase transition-colors hover:text-white sm:flex"
          >
            Shop all <ArrowIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {products.map((product, index) => (
            <FeaturedProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>
      </div>

    </section>
  );
}
