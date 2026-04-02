export function QuoteBlock({ block }) {
  return (
    <blockquote className="border-l-2 border-white py-6 pl-8">
      <p className="text-2xl font-medium italic text-white">{block.text}</p>
      {block.author && (
        <footer className="mt-4 text-xs font-medium tracking-widest text-zinc-500 uppercase">
          {block.author}
        </footer>
      )}
    </blockquote>
  );
}
