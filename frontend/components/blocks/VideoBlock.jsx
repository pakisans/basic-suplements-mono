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
      className="relative overflow-hidden bg-zinc-950 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(255,255,255,0.03),transparent)]" />

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
          <div className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-white/10" />
          <div className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 border-l border-t border-white/10" />

          {block.caption && (
            <figcaption className="mt-5 text-center text-[10px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
              {block.caption}
            </figcaption>
          )}
        </figure>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
