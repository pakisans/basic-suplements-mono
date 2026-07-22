import Link from 'next/link';
import { RichText } from '@/components/ui/RichText';
import { ProductCard } from '@/components/product/ProductCard';

const ArrowIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
      clipRule="evenodd"
    />
  </svg>
);

export function ArchiveBlock({ block }) {
  const raw = block.populatedDocs ?? block.selectedDocs ?? [];
  const products = raw
    .map((item) => (item?.value ?? item))
    .filter((p) => p?.id);

  return (
    <section
      aria-label="Product archive"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">Products</p>
            {block.introContent ? (
              <div className="[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white md:[&_h1]:text-5xl md:[&_h2]:text-5xl [&_p]:mt-3 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_strong]:text-white">
                <RichText content={block.introContent} />
              </div>
            ) : (
              <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
                Shop all
              </h2>
            )}
            <div className="mt-4 h-px w-12 bg-white/20" />
          </div>

          {products.length > 0 && (
            <Link
              href="/products"
              className="group hidden shrink-0 items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase transition-colors hover:text-white sm:flex"
            >
              Shop all <ArrowIcon />
            </Link>
          )}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id ?? i} product={product} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center border border-white/5 bg-zinc-900/50">
            <p className="text-[13px] font-medium tracking-widest text-zinc-600 uppercase">
              No products to display
            </p>
          </div>
        )}

        {/* CTA */}
        {products.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:border-white hover:bg-white hover:text-black"
            >
              Pogledaj sve <ArrowIcon />
            </Link>
          </div>
        )}
      </div>

    </section>
  );
}
