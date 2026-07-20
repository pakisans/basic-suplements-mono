import { RichText } from '@/components/ui/RichText';

export function BannerBlock({ block }) {
  if (!block?.content) return null;

  return (
    <section
      aria-label="Announcement"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

      <div className="container relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <RichText
          content={block.content}
          className="text-center [&_blockquote]:border-zinc-700 [&_blockquote]:text-zinc-300 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:mb-4 [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-white [&_li]:text-zinc-400 [&_ol]:mt-3 [&_ol]:space-y-1.5 [&_ol]:text-left [&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_p:last-child]:mb-0 [&_strong]:text-white [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_ul]:text-left [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a:hover]:decoration-white"
        />
      </div>

    </section>
  );
}
