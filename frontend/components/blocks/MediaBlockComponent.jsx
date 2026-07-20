import { PayloadImage } from '@/components/ui/PayloadImage';

export function MediaBlockComponent({ block }) {
  if (!block.media) return null;

  return (
    <section
      aria-label={block.caption ?? 'Media'}
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

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

          {block.caption && (
            <figcaption className="mt-5 text-center text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
              {block.caption}
            </figcaption>
          )}
        </figure>
      </div>

    </section>
  );
}
