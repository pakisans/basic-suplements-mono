export function CodeBlock({ block }) {
  if (!block.code) return null;

  return (
    <section
      aria-label="Code snippet"
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

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
      </div>

    </section>
  );
}
