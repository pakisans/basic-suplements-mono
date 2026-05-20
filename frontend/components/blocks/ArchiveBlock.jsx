import Link from 'next/link';
import { RichText } from '@/components/ui/RichText';
import { ProductCard } from '@/components/product/ProductCard';

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
  </svg>
);

export function ArchiveBlock({ block }) {
  const products = block.populatedDocs ?? block.selectedDocs ?? [];

  return (
    <section
      aria-label="Product archive"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent)]" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {block.introContent && (
          <div className="mb-12 max-w-2xl [&_h1]:mb-3 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:mb-3 [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_strong]:text-white">
            <RichText content={block.introContent} />
            <div className="mt-4 h-px w-12 bg-white/20" />
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-px bg-white/5 ring-1 ring-white/8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-950">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center border border-white/5 bg-zinc-900">
            <p className="text-[13px] font-medium tracking-widest text-zinc-600 uppercase">
              No products to display
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:border-white hover:bg-white hover:text-black"
          >
            View all products <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
