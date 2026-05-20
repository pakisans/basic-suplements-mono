import { PayloadImage } from '@/components/ui/PayloadImage';

const STARS = [1, 2, 3, 4, 5];

export function QuoteBlock({ block }) {
  if (!block.text) return null;
  const rating = block.rating ? parseInt(block.rating, 10) : null;

  return (
    <section
      aria-label="Testimonial"
      className="relative overflow-hidden bg-zinc-950 py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />

      <div className="container relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* decorative large quote mark */}
        <div
          aria-hidden="true"
          className="mb-8 font-serif text-9xl leading-none text-white/5 select-none"
        >
          &ldquo;
        </div>

        <figure>
          {rating && (
            <div className="mb-8 flex justify-center gap-1.5" aria-label={`${rating} out of 5 stars`}>
              {STARS.map((s) => (
                <svg
                  key={s}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`h-4 w-4 ${s <= rating ? 'text-white' : 'text-zinc-800'}`}
                  aria-hidden="true"
                >
                  <path d="M8 1.5l1.73 3.51 3.87.56-2.8 2.73.66 3.85L8 10.27 4.54 12.15l.66-3.85-2.8-2.73 3.87-.56L8 1.5z" />
                </svg>
              ))}
            </div>
          )}

          <blockquote>
            <p className="text-2xl font-semibold italic leading-snug tracking-tight text-white md:text-3xl lg:text-4xl">
              &ldquo;{block.text}&rdquo;
            </p>
          </blockquote>

          {(block.author || block.avatar) && (
            <figcaption className="mt-10 flex items-center justify-center gap-4">
              {block.avatar && (
                <div className="relative h-12 w-12 overflow-hidden ring-1 ring-white/15">
                  <PayloadImage media={block.avatar} fill className="object-cover" />
                </div>
              )}
              <div className="text-left">
                <div className="h-px w-8 bg-white/20 mb-3" />
                {block.author && (
                  <cite className="not-italic text-sm font-bold tracking-wide text-white">
                    {block.author}
                  </cite>
                )}
                {block.role && (
                  <p className="mt-0.5 text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
                    {block.role}
                  </p>
                )}
              </div>
            </figcaption>
          )}
        </figure>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
