'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { PUBLIC_PAYLOAD_URL } from '@/constants';

/**
 * Science Intro — struktura preuzeta sa seed.com "MicrobioSection", paleta je
 * NAŠA (crna tema): crna sekcija, 12-kolonski grid; levo brand oznaka u uglastim
 * zagradama, veliki naslov, tekst i belo pill dugme sa play krugom, u dnu
 * "SCIENCE / …" oznaka; desno veliki kvadratni vizual (video ili animirana slika).
 *
 * Geometrija je 1:1 sa originalom (izmereno sa seed.com):
 *   sekcija   padding 0 32px, min-height 760px
 *   grid      12 kolona / gap 32px / align-items center, max-w 1440
 *   brand     20px / 18px, weight 350, letter-spacing -0.6px (prikačen za vrh)
 *   naslov    col span 5, 48px / 52.8px, weight 350, letter-spacing -0.72px
 *   body      16px / 20.8px, margin-top 32px
 *   dugme     pill, padding 5px 5px 5px 34px, gap 18px, play krug 38px, margin-top 32px
 *   footer    prikačen za dno; label 16px/24 uppercase ls 0.24px, naslov 16px/24 w500
 *   vizual    col span 6, kvadrat 1/1, radius 32px, video autoplay+loop+muted
 *
 * Animacije:
 *   ulaz u viewport: brand → naslov → tekst → dugme → footer (stagger 90ms,
 *   translateY 16px + fade), vizual fade + scale 0.96 → 1
 *   video se pušta samo dok je sekcija u vidnom polju
 *   slika (kad nema videa) ima spori Ken Burns / lebdenje — `bs-ken-burns` / `bs-float`
 *   dugme bez URL-a otvara video u lightboxu (Esc / klik na pozadinu zatvara)
 */

function mediaUrl(media) {
  if (!media) return null;
  const raw = typeof media === 'string' ? media : media.url;
  if (!raw) return null;
  return raw.startsWith('http') ? raw : `${PUBLIC_PAYLOAD_URL}${raw}`;
}

export function ScienceIntroBlock({ block }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(false), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox]);

  const media = block?.media || {};
  const cta = block?.cta || {};
  const footer = block?.footer || {};
  const mediaLeft = block?.mediaSide === 'left';
  const videoSrc = mediaUrl(media.video) || media.videoUrl || null;
  const imageSrc = mediaUrl(media.image);
  const motion = media.motion ?? 'zoom';
  const motionClass =
    !videoSrc && motion === 'zoom'
      ? 'bs-ken-burns'
      : !videoSrc && motion === 'float'
        ? 'bs-float'
        : '';

  // Ulazna animacija: svaki element dobija svoj delay (stagger 90ms).
  const rise = (step) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(16px)',
    transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${step * 90}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${step * 90}ms`,
  });

  return (
    <section
      ref={sectionRef}
      aria-label={block?.heading || 'Science'}
      className="border-t border-zinc-900 bg-black px-6 py-16 text-white md:px-8 lg:min-h-[760px] lg:py-0"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 lg:min-h-[760px] lg:grid-cols-12">
        {/* Tekstualna kolona */}
        <div
          className={`flex flex-col gap-10 lg:col-span-5 lg:min-h-[760px] lg:justify-between lg:gap-0 lg:py-12 ${
            mediaLeft ? 'lg:order-2 lg:col-start-8' : 'lg:order-1'
          }`}
        >
          {block?.brandMark && (
            <p
              className="m-0 text-[20px] leading-[18px] tracking-[-0.6px] text-zinc-400"
              style={{ fontWeight: 350, ...rise(0) }}
            >
              {block.brandMark} <span aria-hidden="true">【</span>
              <CapsuleMark />
              <span aria-hidden="true">】</span>
            </p>
          )}

          <div>
            <h2
              className="m-0 text-[34px] leading-[38px] tracking-[-0.72px] text-white md:text-[48px] md:leading-[52.8px]"
              style={{ fontWeight: 350, ...rise(1) }}
            >
              {block?.heading}
            </h2>

            {block?.body && (
              <p
                className="mt-8 max-w-[36rem] text-[16px] leading-[20.8px] text-zinc-400"
                style={rise(2)}
              >
                {block.body}
              </p>
            )}

            {cta.label && (
              <div className="mt-8" style={rise(3)}>
                {cta.url ? (
                  <Link href={cta.url} className={ctaClass}>
                    {cta.label}
                    <PlayCircle />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoSrc && setLightbox(true)}
                    className={ctaClass}
                    aria-haspopup={videoSrc ? 'dialog' : undefined}
                  >
                    {cta.label}
                    <PlayCircle />
                  </button>
                )}
              </div>
            )}
          </div>

          {(footer.label || footer.title) && (
            <p className="m-0 flex flex-wrap items-baseline gap-2" style={rise(4)}>
              {footer.label && (
                <span className="text-[16px] uppercase leading-6 tracking-[0.24px] text-zinc-500">
                  {footer.label}
                </span>
              )}
              {footer.title && (
                <span className="text-[16px] font-medium leading-6 tracking-[-0.12px] text-white">
                  {footer.title}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Vizual */}
        {(videoSrc || imageSrc) && (
          <figure
            className={`relative m-0 aspect-square w-full overflow-hidden rounded-[32px] bg-zinc-900 lg:col-span-6 ${
              mediaLeft ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-7'
            }`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1)' : 'scale(0.96)',
              transition:
                'opacity 900ms cubic-bezier(0.16,1,0.3,1) 120ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 120ms',
            }}
          >
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                poster={imageSrc ?? undefined}
                loop
                muted
                playsInline
                aria-label={block?.heading || ''}
                className="h-full w-full object-cover"
              />
            ) : (
              <PayloadImage
                media={media.image}
                fill
                className={`object-cover ${motionClass}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </figure>
        )}
      </div>

      {lightbox && videoSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={block?.heading || 'Video'}
          onClick={closeLightbox}
          className="bs-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Zatvori"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20"
          >
            ×
          </button>
          <video
            src={videoSrc}
            poster={imageSrc ?? undefined}
            controls
            autoPlay
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="bs-card-in max-h-full w-full max-w-4xl rounded-2xl"
          />
        </div>
      )}
    </section>
  );
}

const ctaClass =
  'group inline-flex items-center gap-[18px] rounded-full bg-white py-[5px] pl-[34px] pr-[5px] text-[16px] font-medium text-black transition-colors hover:bg-zinc-200';

function PlayCircle() {
  return (
    <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className="h-3 w-3 text-white"
      >
        <path d="M12.4231 8 5.5 12.5v-9L12.4231 8Z" />
      </svg>
    </span>
  );
}

/** Mali znak između uglastih zagrada — kapsula, kao brand oznaka. */
function CapsuleMark() {
  return (
    <svg
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden="true"
      className="mx-1 inline-block h-[13px] w-[20px] align-middle"
    >
      <rect
        x="1"
        y="2"
        width="22"
        height="12"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 2.75v10.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
