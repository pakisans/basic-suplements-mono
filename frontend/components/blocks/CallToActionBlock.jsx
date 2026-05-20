import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

export function CallToActionBlock({ block }) {
  return (
    <section
      aria-label="Call to action"
      className="relative overflow-hidden bg-zinc-950 py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />

      <div className="container relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* decorative row */}
        <div className="mb-12 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-20 bg-white/10" />
          <span className="h-1 w-1 rotate-45 bg-white/20" />
          <span className="h-1.5 w-1.5 rotate-45 bg-white/30" />
          <span className="h-1 w-1 rotate-45 bg-white/20" />
          <span className="h-px w-20 bg-white/10" />
        </div>

        {block.richText && (
          <div className="[&_h1]:mb-5 [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:mb-5 [&_h2]:text-5xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white md:[&_h1]:text-6xl md:[&_h2]:text-6xl [&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_p:last-child]:mb-0 [&_strong]:text-white">
            <RichText content={block.richText} />
          </div>
        )}

        {block.links?.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {block.links.map((item, index) => (
              <LinkButton key={index} link={item.link} />
            ))}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
