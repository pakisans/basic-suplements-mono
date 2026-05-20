import { RichText } from '@/components/ui/RichText';

export function BannerBlock({ block }) {
  if (!block?.content) return null;

  return (
    <section
      aria-label="Announcement"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />

      <div className="container relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* decorative top rule */}
        <div className="mb-10 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-white/10" />
          <span className="h-1 w-1 rotate-45 bg-white/30" />
          <span className="h-1.5 w-1.5 rotate-45 bg-white/20" />
          <span className="h-1 w-1 rotate-45 bg-white/30" />
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <RichText
          content={block.content}
          className="text-center [&_blockquote]:border-zinc-700 [&_blockquote]:text-zinc-300 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:mb-4 [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-white [&_li]:text-zinc-400 [&_ol]:mt-3 [&_ol]:space-y-1.5 [&_ol]:text-left [&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_p:last-child]:mb-0 [&_strong]:text-white [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ul]:text-left [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a:hover]:decoration-white"
        />

        {/* decorative bottom rule */}
        <div className="mt-10 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-white/10" />
          <span className="h-1 w-1 rotate-45 bg-white/30" />
          <span className="h-1.5 w-1.5 rotate-45 bg-white/20" />
          <span className="h-1 w-1 rotate-45 bg-white/30" />
          <span className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
