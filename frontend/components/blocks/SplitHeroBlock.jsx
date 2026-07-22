import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';

function Panel({ panel, priority }) {
  const href = panel?.url || '/products';
  const title = panel?.title ?? '';
  const eyebrow = panel?.eyebrow ?? '';

  return (
    <Link
      href={href}
      className="group relative flex min-h-[75vh] flex-1 cursor-pointer flex-col overflow-hidden rounded-sm bg-zinc-900 md:min-h-[88vh]"
      aria-label={title || 'Shop'}
    >
      {panel?.image && (
        <div className="absolute inset-0">
          <PayloadImage
            media={panel.image}
            fill
            priority={priority}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="relative mt-auto p-7 md:p-10">
        {eyebrow && (
          <p className="text-3xl font-extrabold uppercase leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
            {eyebrow.toUpperCase()}
          </p>
        )}
        <p className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {title.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}

export function SplitHeroBlock({ block }) {
  const panels = (block?.panels ?? []).slice(0, 2);
  if (!panels.length) return null;

  return (
    <section
      className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 md:flex-row md:gap-3"
      aria-label="Featured"
    >
      {panels.map((panel, index) => (
        <Panel key={panel.id ?? index} panel={panel} priority={index === 0} />
      ))}
    </section>
  );
}
