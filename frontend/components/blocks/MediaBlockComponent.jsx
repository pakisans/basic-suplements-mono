import { PayloadImage } from '@/components/ui/PayloadImage';

export function MediaBlockComponent({ block }) {
  if (!block.media) return null;

  return (
    <section
      aria-label={block.caption ?? 'Media'}
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_50%,rgba(255,255,255,0.03),transparent)]" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <figure>
          <div className="relative overflow-hidden ring-1 ring-white/10">
            <PayloadImage
              media={block.media}
              width={1600}
              height={900}
              className="w-full object-cover"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/50 to-transparent" />
          </div>

          {/* corner accents */}
          <div className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-white/10" />
          <div className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 border-l border-t border-white/10" />

          {block.caption && (
            <figcaption className="mt-5 text-center text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
              {block.caption}
            </figcaption>
          )}
        </figure>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
