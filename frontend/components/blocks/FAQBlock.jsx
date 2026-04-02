import { RichText } from '@/components/ui/RichText';

export function FAQBlock({ block }) {
  return (
    <div className="space-y-4">
      {block.title && (
        <h2 className="text-2xl font-bold text-white">{block.title}</h2>
      )}
      {(block.items ?? []).map((item, index) => (
        <details
          key={item.id ?? index}
          className="border border-zinc-800 p-5 transition-colors hover:border-zinc-700"
        >
          <summary className="cursor-pointer font-medium text-white">
            {item.question}
          </summary>
          <div className="mt-4 text-zinc-400">
            <RichText content={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
