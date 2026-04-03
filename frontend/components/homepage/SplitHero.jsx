import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { buildCategoryPath } from '@/services/categories';

function HeroPanel({ category, fallbackLabel, fallbackHref, priority }) {
  const href = category ? buildCategoryPath(category) : fallbackHref;
  const label = category?.title ?? fallbackLabel;
  const image = category?.image ?? null;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[75vh] flex-1 cursor-pointer flex-col overflow-hidden rounded-sm bg-zinc-900 md:min-h-[88vh]"
      aria-label={`Kupuj: ${label}`}
    >
      {image && (
        <div className="absolute inset-0">
          <PayloadImage
            media={image}
            fill
            priority={priority}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="relative mt-auto p-7 md:p-10">
        <p className="text-3xl font-extrabold uppercase leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
          SHOP
        </p>
        <p className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {label.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}

export function SplitHero({ categories = [] }) {
  const first = categories[0] ?? null;
  const second = categories[1] ?? null;

  return (
    <section
      className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 md:flex-row md:gap-3"
      aria-label="Kategorije prodavnice"
    >
      <HeroPanel
        category={first}
        fallbackLabel="Supplements"
        fallbackHref="/proizvodi"
        priority
      />
      <HeroPanel
        category={second}
        fallbackLabel="Apparel"
        fallbackHref="/proizvodi"
        priority={false}
      />
    </section>
  );
}
