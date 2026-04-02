import { PayloadImage } from '@/components/ui/PayloadImage';

export function VideoBlock({ block }) {
  if (block.embed) {
    return (
      <div className="aspect-video overflow-hidden rounded-3xl">
        <iframe
          src={block.embed}
          title={block.title ?? 'Video'}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (block.thumbnail) {
    return (
      <div className="overflow-hidden rounded-3xl">
        <PayloadImage
          media={block.thumbnail}
          width={1600}
          height={900}
          className="w-full object-cover"
        />
      </div>
    );
  }

  return null;
}
