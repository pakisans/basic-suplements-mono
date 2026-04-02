import { PayloadImage } from '@/components/ui/PayloadImage';

export function MediaBlockComponent({ block }) {
  if (!block.media) return null;

  return (
    <div className="overflow-hidden">
      <PayloadImage
        media={block.media}
        width={1600}
        height={900}
        className="w-full object-cover"
      />
    </div>
  );
}
