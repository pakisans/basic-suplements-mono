import { RichText } from '@/components/ui/RichText';

function lexicalToText(content) {
  if (!content?.root?.children) return '';
  return content.root.children
    .map((node) => (node.children ?? []).map((c) => c.text ?? '').join(''))
    .join(' ')
    .trim();
}

export function FAQBlock({ block }) {
  const items = block.items ?? [];
  if (!items.length) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: lexicalToText(item.answer) },
    })),
  };

  return (
    <section
      aria-label="Frequently asked questions"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.04),transparent)]" />

      <div className="container relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {block.heading && (
          <div className="mb-14">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
              FAQ
            </p>
            <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
              {block.heading}
            </h2>
            <div className="mt-4 h-px w-12 bg-white/20" />
          </div>
        )}

        <dl className="divide-y divide-white/5">
          {items.map((item, index) => (
            <details
              key={item.id ?? index}
              className="group py-6 [&[open]>summary>svg]:rotate-45"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-semibold text-white transition-colors hover:text-zinc-300 [&::-webkit-details-marker]:hidden">
                <dt>{item.question}</dt>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600 transition-transform duration-200"
                  aria-hidden="true"
                >
                  <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                </svg>
              </summary>
              <dd className="mt-5 text-[15px] leading-relaxed text-zinc-400 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a:hover]:decoration-white [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1.5">
                <RichText content={item.answer} />
              </dd>
            </details>
          ))}
        </dl>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
