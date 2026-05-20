import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { RichText } from '@/components/ui/RichText';

function getEmbedUrl(platform, url) {
  if (!url) return null;
  if (platform === 'youtube') {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return id
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`
      : null;
  }
  if (platform === 'vimeo') {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?color=ffffff&title=0&byline=0` : null;
  }
  return url;
}

export function AmbassadorBlock({ block }) {
  const { eyebrow, heading, role, description, video, layout = 'media-right', cta } = block;
  const embedUrl = video?.url ? getEmbedUrl(video?.platform ?? 'youtube', video.url) : null;
  const reverse = layout === 'media-left';

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 md:py-28">
      {/* ambient glow top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent)]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20 ${reverse ? 'lg:flex-row-reverse' : ''}`}
        >
          {/* Text side */}
          <div className="flex flex-1 flex-col justify-center gap-6">
            {eyebrow && (
              <p className="text-[10px] font-semibold tracking-[0.4em] text-zinc-500 uppercase">
                {eyebrow}
              </p>
            )}

            <div>
              <h2 className="text-5xl font-extrabold leading-none tracking-tight text-white md:text-6xl lg:text-7xl">
                {heading}
              </h2>
              {role && (
                <p className="mt-3 text-xs font-semibold tracking-[0.3em] text-zinc-500 uppercase">
                  {role}
                </p>
              )}
            </div>

            {/* accent line */}
            <div className="h-px w-12 bg-white/20" />

            {description && (
              <div className="max-w-lg text-[15px] leading-relaxed text-zinc-400 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1">
                <RichText content={description} />
              </div>
            )}

            {cta?.label && cta?.url && (
              <div className="pt-2">
                <Link
                  href={cta.url}
                  className="group inline-flex items-center gap-3 bg-white px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] text-black uppercase transition-colors hover:bg-zinc-100"
                >
                  {cta.label}
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Video side */}
          <div className="relative flex-1">
            <div className="relative overflow-hidden ring-1 ring-white/10">
              {embedUrl ? (
                <div className="aspect-video bg-zinc-900">
                  <iframe
                    src={embedUrl}
                    title={heading ?? 'Ambassador video'}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : video?.thumbnail ? (
                <div className="relative aspect-video bg-zinc-900">
                  <PayloadImage media={video.thumbnail} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-zinc-900" />
              )}
            </div>
            {/* corner accent */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-white/10" />
            <div className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 border-l border-t border-white/10" />
          </div>
        </div>
      </div>

      {/* ambient glow bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
