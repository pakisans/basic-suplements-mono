export function StatsBlock({ block }) {
  const items = block.items ?? [];
  if (!items.length) return null;

  return (
    <section
      aria-label="Key statistics"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {block.heading && (
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
              By the numbers
            </p>
            <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
              {block.heading}
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-white/20" />
          </div>
        )}

        <dl className="grid grid-cols-2 gap-px bg-white/5 ring-1 ring-white/8 md:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id ?? index}
              className="flex flex-col items-center justify-center gap-2 bg-zinc-950 px-6 py-12 text-center"
            >
              <dd className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
                {item.value}
              </dd>
              <dt className="text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
