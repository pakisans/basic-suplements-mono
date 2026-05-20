import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

export function ContentBlock({ block }) {
  const columns = block.columns ?? [];
  if (!columns.length) return null;

  const isSingle = columns.length === 1;

  return (
    <section
      aria-label="Content"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(255,255,255,0.04),transparent)]" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            isSingle
              ? 'mx-auto max-w-3xl'
              : 'grid gap-px bg-white/5 ring-1 ring-white/8 md:grid-cols-2'
          }
        >
          {columns.map((column, index) => (
            <article
              key={column.id ?? index}
              className={`flex flex-col gap-5 ${isSingle ? '' : 'bg-zinc-950 p-10 md:p-12'}`}
            >
              <p className="text-[10px] font-semibold tracking-[0.4em] text-zinc-600 uppercase" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>

              {column.richText && (
                <div className="text-[15px] leading-relaxed text-zinc-400 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h4]:mb-2 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-white [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-4 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a:hover]:decoration-white">
                  <RichText content={column.richText} />
                </div>
              )}

              {column.enableLink && column.link && (
                <div className="mt-auto pt-2">
                  <LinkButton link={column.link} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
