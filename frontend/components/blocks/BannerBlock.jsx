import { RichText } from '@/components/ui/RichText';

export function BannerBlock({ block }) {
  if (!block?.content) return null;

  return (
    <section className="relative overflow-hidden border border-zinc-800 bg-linear-to-br from-zinc-950 via-black to-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.14),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-white/70" />
        </div>

        <RichText
          content={block.content}
          className="max-w-3xl [&_a]:text-white [&_a]:decoration-zinc-600 [&_a]:underline-offset-4 [&_a:hover]:decoration-white [&_blockquote]:border-zinc-600 [&_blockquote]:text-zinc-300 [&_h1]:text-3xl [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:text-2xl [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:text-xl [&_h3]:tracking-tight [&_h3]:text-white [&_li]:text-zinc-300 [&_ol]:text-zinc-300 [&_p]:max-w-2xl [&_p]:text-base [&_p]:leading-8 [&_p]:text-zinc-200 [&_strong]:text-white [&_ul]:text-zinc-300"
        />
      </div>
    </section>
  );
}
