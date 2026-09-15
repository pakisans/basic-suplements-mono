import { PayloadImage } from '@/components/ui/PayloadImage';
import { PUBLIC_PAYLOAD_URL } from '@/constants';

/**
 * Media block — jedna slika (ili video) iz medija.
 *
 * Prikaz se vodi PRAVIM formatom fajla, ne fiksnim 16:9:
 *   - okvir dobija aspect-ratio iz `media.width/height`, pa nema ni kropovanja
 *     ni skoka layouta (CLS) dok se slika učitava
 *   - pejzaž ide punom širinom kontejnera, kvadrat do 672px, portret do 448/512px
 *     — da uspravna slika ne zauzme ceo ekran na desktopu
 *   - ako medij nema dimenzije (npr. ručno unet URL), pada na 16:9
 *   - `sizes` se računa iz orijentacije, da browser skida pravu veličinu
 *   - video fajl (mimeType video/*) se renderuje kao <video> sa kontrolama
 */
function mediaUrl(media) {
  if (!media) return null;
  const raw = typeof media === 'string' ? media : media.url;
  if (!raw) return null;
  return raw.startsWith('http') ? raw : `${PUBLIC_PAYLOAD_URL}${raw}`;
}

export function MediaBlockComponent({ block }) {
  const media = block?.media;
  if (!media) return null;

  const isVideo =
    typeof media !== 'string' && (media.mimeType ?? '').startsWith('video');

  const width = typeof media === 'string' ? null : media.width;
  const height = typeof media === 'string' ? null : media.height;
  const ratio = width && height ? width / height : null;

  // Orijentacija određuje koliko slika sme da se raširi na velikim ekranima.
  const isPortrait = ratio !== null && ratio < 0.85;
  const isSquarish = ratio !== null && ratio >= 0.85 && ratio < 1.2;

  const frameWidth = isPortrait
    ? 'max-w-md sm:max-w-lg'
    : isSquarish
      ? 'max-w-2xl'
      : 'max-w-none';

  const sizes = isPortrait
    ? '(max-width: 640px) 100vw, 512px'
    : isSquarish
      ? '(max-width: 640px) 100vw, 672px'
      : '(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1280px';

  const caption = block.caption;
  const label =
    caption || (typeof media !== 'string' ? media.alt : null) || 'Media';

  return (
    <section
      aria-label={label}
      className="relative border-t border-white/6 bg-black py-12 sm:py-16 md:py-24 lg:py-32"
    >
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <figure className={`mx-auto ${frameWidth}`}>
          <div
            className="relative w-full overflow-hidden bg-zinc-900 ring-1 ring-white/10"
            style={ratio ? { aspectRatio: `${width} / ${height}` } : undefined}
          >
            {isVideo ? (
              <video
                src={mediaUrl(media)}
                controls
                playsInline
                preload="metadata"
                aria-label={label}
                className={`h-full w-full object-cover ${ratio ? '' : 'aspect-video'}`}
              />
            ) : (
              <PayloadImage
                media={media}
                fill={Boolean(ratio)}
                width={ratio ? undefined : 1600}
                height={ratio ? undefined : 900}
                sizes={sizes}
                className={ratio ? '' : 'h-auto w-full object-cover'}
              />
            )}

            {!isVideo && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/50 to-transparent sm:h-24 md:h-32" />
            )}
          </div>

          {caption && (
            <figcaption className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 sm:tracking-[0.3em] md:mt-5">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
