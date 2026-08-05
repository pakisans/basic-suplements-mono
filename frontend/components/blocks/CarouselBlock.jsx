import Link from 'next/link';
import { FeaturedProductCard } from '@/components/product/FeaturedProductCard';
import { getProducts } from '@/services/products';

// Products come from the CMS: either an individually-selected list or a
// collection (optionally filtered by categories). The backend does not
// auto-populate `populatedDocs`, so in collection mode we fetch here.
async function resolveProducts(block) {
  if (block.populateBy === 'selection') {
    return (block.selectedDocs ?? [])
      .map((item) => item?.value ?? item)
      .filter((p) => p?.id);
  }

  if (Array.isArray(block.populatedDocs) && block.populatedDocs.length) {
    return block.populatedDocs.map((item) => item?.value ?? item).filter((p) => p?.id);
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

export async function CarouselBlock({ block }) {
  const products = (await resolveProducts(block)).slice(0, 4);
  if (!products.length) return null;

  // Emphasise the second card for visual rhythm (only when there are enough).
  const featuredIndex = products.length >= 4 ? 1 : -1;

  return (
    <section
      aria-label="Featured products"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
            Built for real results.
          </h2>
          <div className="flex items-start justify-between gap-8 md:justify-end md:gap-12">
            <p className="max-w-xs text-[15px] leading-relaxed text-zinc-400">
              Premium formulations with carefully selected, clinically-backed ingredients — at honest prices.
            </p>
            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b border-white/40 pb-1 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              Shop all
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              featured={index === featuredIndex}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
