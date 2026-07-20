import { PayloadImage } from '@/components/ui/PayloadImage';

function getEmbedUrl(platform, url) {
  if (!url) return null;
  if (platform === 'youtube') {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white` : null;
  }
  if (platform === 'vimeo') {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?color=ffffff&title=0&byline=0` : null;
  }
  return url;
}

export function VideoBlock({ block }) {
  const embedUrl = block.url
    ? getEmbedUrl(block.platform ?? 'youtube', block.url)
    : (block.embed ?? null);

  if (!embedUrl && !block.thumbnail) return null;

  return (
    <section
      aria-label={block.caption ?? 'Video'}
      className="relative bg-black border-t border-white/[0.06] py-24 md:py-32"
    >

      <div className="container relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <figure>
          <div className="relative overflow-hidden ring-1 ring-white/10">
            {embedUrl ? (
              <div className="aspect-video bg-zinc-900">
                <iframe
                  src={embedUrl}
                  title={block.caption ?? 'Video'}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-zinc-900">
                <PayloadImage
                  media={block.thumbnail}
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
            )}
          </div>

          {/* corner accents */}

          {block.caption && (
            <figcaption className="mt-5 text-center text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
              {block.caption}
            </figcaption>
          )}
        </figure>
      </div>

    </section>
  );
}
