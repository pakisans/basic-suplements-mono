import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
  </svg>
);

export function CarouselBlock({ block }) {
  const products = block.populatedDocs ?? block.selectedDocs ?? [];
  if (!products.length) return null;

  return (
    <section
      aria-label="Featured products"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent)]" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
              Selection
            </p>
            <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
              Featured Products
            </h2>
            <div className="mt-4 h-px w-12 bg-white/20" />
          </div>
          <Link
            href="/products"
            className="group hidden shrink-0 items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase transition-colors hover:text-white sm:flex"
          >
            View all <ArrowIcon />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/5 ring-1 ring-white/8 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-950">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between sm:hidden">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase transition-colors hover:text-white"
          >
            View all products <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
