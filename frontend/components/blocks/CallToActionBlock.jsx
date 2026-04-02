import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

export function CallToActionBlock({ block }) {
  return (
    <div className="border border-zinc-700 bg-zinc-950 px-6 py-10 text-white md:px-10">
      {block.richText && <RichText content={block.richText} />}
      {block.links?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {block.links.map((link, index) => (
            <LinkButton key={index} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}
