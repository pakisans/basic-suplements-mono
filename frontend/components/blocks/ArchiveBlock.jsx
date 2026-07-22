import Link from 'next/link';
import { RichText } from '@/components/ui/RichText';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { getProducts } from '@/services/products';

const INTRO_CLASSES =
  '[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-[1.05] [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:leading-[1.05] [&_h2]:tracking-tight [&_h2]:text-white md:[&_h1]:text-5xl md:[&_h2]:text-5xl [&_p]:mt-3 [&_p]:max-w-md [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_strong]:text-white';

// Products come from the CMS: either a collection (optionally filtered by
// categories) or an individually-selected list.
async function resolveProducts(block) {
  if (block.populateBy === 'selection') {
    return (block.selectedDocs ?? [])
      .map((item) => item?.value ?? item)
      .filter((p) => p?.id);
  }

  const categories = (block.categories ?? [])
    .map((c) => (c && typeof c === 'object' ? c.slug : null))
    .filter(Boolean);

  const res = await getProducts(
    categories.length ? { categories } : {},
    { limit: block.limit ?? 8 },
  );
  return (res.docs ?? []).filter((p) => p?.id);
}

export async function ArchiveBlock({ block }) {
  const products = await resolveProducts(block);
  if (!products.length) return null;

  // Emphasise the second card (solid white Shop Now), like the reference.
  const featuredIndex = products.length >= 2 ? 1 : -1;

  return (
    <section
      aria-label="Products"
      className="relative border-t border-white/[0.06] bg-black py-24 md:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: headline left, Shop All right */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          <div className={INTRO_CLASSES}>
            {block.introContent ? (
              <RichText content={block.introContent} />
            ) : (
              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
                Shop the full range
              </h2>
            )}
          </div>

          <div className="flex md:justify-end">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 whitespace-nowrap border-b border-white/40 pb-1 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              Shop All
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        <ProductCarousel products={products} featuredIndex={featuredIndex} />
      </div>
    </section>
  );
}
