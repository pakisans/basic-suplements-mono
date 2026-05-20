export function CodeBlock({ block }) {
  if (!block.code) return null;

  return (
    <section
      aria-label="Code snippet"
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,255,255,0.03),transparent)]" />

      <div className="container relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden ring-1 ring-white/10">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900 px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" aria-hidden="true" />
            <span className="ml-4 font-mono text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
              {block.language ?? 'code'}
            </span>
          </div>

          <pre className="overflow-x-auto bg-black p-8 font-mono text-[13px] leading-7 text-zinc-300">
            <code>{block.code}</code>
          </pre>
        </div>

        {/* corner accents */}
        <div className="pointer-events-none absolute -bottom-3 -right-3 h-12 w-12 border-b border-r border-white/10" />
        <div className="pointer-events-none absolute -left-3 -top-3 h-12 w-12 border-l border-t border-white/10" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
