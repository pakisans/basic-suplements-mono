import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

const RICH_TEXT_CLASSES =
  'text-[15px] leading-relaxed text-zinc-400 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:leading-none [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h4]:mb-2 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-white [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-4 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a:hover]:decoration-white';

const COL_SPAN = {
  oneThird: 'md:col-span-2',
  half: 'md:col-span-3',
  twoThirds: 'md:col-span-4',
  full: 'md:col-span-6',
};

export function ContentBlock({ block }) {
  const columns = block.columns ?? [];
  if (!columns.length) return null;

  const allFull = columns.every((c) => c.size === 'full');

  return (
    <section
      aria-label="Content"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={allFull ? 'flex flex-col gap-12' : 'grid grid-cols-6 gap-px bg-white/5 ring-1 ring-white/8'}>
          {columns.map((column, index) => {
            const isFull = column.size === 'full';
            return (
              <article
                key={column.id ?? index}
                className={[
                  'flex flex-col gap-5',
                  isFull
                    ? 'col-span-6'
                    : `bg-black p-10 md:p-12 col-span-6 ${COL_SPAN[column.size] ?? 'md:col-span-3'}`,
                ].join(' ')}
              >
                {!isFull && (
                  <p className="text-[10px] font-semibold tracking-[0.4em] text-zinc-600 uppercase" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                )}

                {column.richText && (
                  <div className={RICH_TEXT_CLASSES}>
                    <RichText content={column.richText} />
                  </div>
                )}

                {column.enableLink && column.link && (
                  <div className="mt-auto pt-2">
                    <LinkButton link={column.link} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

    </section>
  );
}
