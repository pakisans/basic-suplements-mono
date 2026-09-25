'use client';

import { useEffect, useRef, useState } from 'react';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { PUBLIC_PAYLOAD_URL } from '@/constants';

/**
 * Capsule Tech - struktura preuzeta sa seed.com "ViaCapSection", paleta je NAŠA
 * (crna tema): foto pozadina zatamnjena, preko nje tamna frosted glass kartica;
 * levo animirani label (slovo po slovo), naslov, "note" kartica sa pill-om i
 * brojačem, disclaimer; desno vizual proizvoda sa dve anotacije povezane
 * isprekidanim linijama.
 *
 * Geometrija je 1:1 sa originalom (izmereno sa seed.com):
 *   sekcija    padding 80px 32px, background-image cover
 *   kartica    max-w 1440, padding 80px, radius 32px, backdrop-blur 37.5px
 *   levo       576px, desno 768px (min-h 400px), gap 32px
 *   label      12px / 18px, uppercase, weight 300
 *   naslov     40px / 44px, weight 350, letter-spacing -0.4px, margin-top 24px
 *   note       inline-flex, padding 32px, radius 16px, border 1px, gap 24px
 *   note pill  12px, border 1.5px, radius 1000px, padding 0 8px
 *   brojač     32px / 48px, weight 300; sufiks 16px; strelica 32px
 *   anotacije  tekst 200px + isprekidana linija 70px, spacer 100px
 *   vizual     400×400, absolute, centriran u desnoj koloni, object-fit contain
 *
 * Animacije na ulazu u viewport (kao na originalu):
 *   kartica translateY 60→0 · kolone ±20→∓10 · strelica 30px/0 → 0/1
 *   brojač 0→N · slova labela ulaze sa stagger-om od 50ms
 */

// Anotacije (OUTER LAYER / INNER CORE) privremeno sakrivene
const SHOW_ANNOTATIONS = false;

function mediaUrl(media) {
  if (!media) return null;
  const raw = typeof media === 'string' ? media : media.url;
  if (!raw) return null;
  return raw.startsWith('http') ? raw : `${PUBLIC_PAYLOAD_URL}${raw}`;
}

export function CapsuleTechBlock({ block }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [inView]);

  const note = block?.note || {};
  const media = block?.media || {};
  const columns = (block?.columns ?? []).slice(0, 2);
  const bg = mediaUrl(block?.backgroundImage);
  const videoSrc = mediaUrl(media.video) || media.videoUrl || null;
  const imageSrc = mediaUrl(media.image);
  const arrow =
    note.arrow === 'down' ? '↓' : note.arrow === 'none' ? null : '↑';

  return (
    <section
      ref={sectionRef}
      aria-label={block?.heading || 'Capsule technology'}
      className="relative overflow-hidden bg-black px-6 py-16 md:px-8 md:py-20"
    >
      {/* Pozadina + zatamnjenje, da beli tekst uvek ima kontrast */}
      {bg && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
        </>
      )}

      {/* Frosted glass kartica */}
      <div
        className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-white backdrop-blur-[37.5px] transition-transform duration-1000 ease-out md:p-12 lg:flex-row lg:items-start lg:p-20"
        style={{ transform: inView ? 'translateY(0px)' : 'translateY(60px)' }}
      >
        {/* Levo: label + naslov + note + disclaimer */}
        <div className="w-full shrink-0 lg:w-[576px]">
          {block?.label && (
            <p className="m-0 text-[12px] font-light uppercase leading-[18px] text-zinc-300">
              <span aria-hidden="true">●</span>{' '}
              <span className="sr-only">{block.label}</span>
              <span aria-hidden="true">
                {[...block.label].map((char, i) => (
                  <span
                    key={`${char}-${i}`}
                    className="inline-block transition-opacity duration-500 ease-out"
                    style={{
                      opacity: inView ? 1 : 0,
                      transitionDelay: `${i * 50}ms`,
                    }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </span>
            </p>
          )}

          <h2
            className="mt-6 text-[32px] leading-[36px] tracking-[-0.4px] text-white md:text-[40px] md:leading-[44px]"
            style={{ fontWeight: 350 }}
          >
            {block?.heading}
          </h2>

          {(note.title || note.metric) && (
            <div className="mt-6 inline-flex items-center gap-6 rounded-2xl border border-white/15 bg-black/20 p-8">
              {note.title && (
                <p
                  className="m-0 text-[18px] leading-[23.4px] text-white"
                  style={{ fontWeight: 350 }}
                >
                  {note.pill && (
                    <span className="mb-1 mr-2 inline-flex items-center rounded-full border-[1.5px] border-white px-2 text-[12px] leading-[18px] text-white">
                      {note.pill}
                    </span>
                  )}
                  {note.title}
                </p>
              )}

              {note.metric && (
                <p className="m-0 flex items-center text-[16px] leading-6 text-white">
                  {arrow && (
                    <span
                      aria-hidden="true"
                      className="block text-[32px] leading-none transition-all duration-700 ease-out"
                      style={{
                        transform: inView
                          ? 'translateY(0px)'
                          : 'translateY(30px)',
                        opacity: inView ? 1 : 0,
                      }}
                    >
                      {arrow}
                    </span>
                  )}
                  <span className="text-[32px] font-light leading-[48px]">
                    <CountUp value={note.metric} active={inView} />
                  </span>
                  {note.metricSuffix && <span>{note.metricSuffix}</span>}
                </p>
              )}
            </div>
          )}

          {block?.disclaimer && (
            <p className="mt-6 text-[12px] leading-[16.8px] text-zinc-400">
              {block.disclaimer}
            </p>
          )}
        </div>

        {/* Desno: vizual + dve anotacije sa isprekidanim linijama */}
        <div className="relative flex w-full flex-col items-center gap-8 lg:min-h-[400px] lg:w-[768px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          {(videoSrc || imageSrc) && (
            <div className="pointer-events-none z-[5] flex h-[280px] w-[280px] items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[400px] lg:w-[400px] lg:-translate-x-1/2 lg:-translate-y-1/2">
              {videoSrc ? (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  poster={imageSrc ?? undefined}
                  width={400}
                  height={400}
                  loop
                  muted
                  playsInline
                  aria-label={block?.heading || 'Product 360°'}
                  className="h-full w-full"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="relative h-full w-full">
                  <PayloadImage
                    media={media.image}
                    fill
                    className="object-contain"
                    sizes="400px"
                  />
                </div>
              )}
            </div>
          )}

          {SHOW_ANNOTATIONS && columns[0] && (
            <div className="z-10 flex w-full max-w-[320px] items-center lg:-mt-[30px] lg:mb-24 lg:w-[270px] lg:max-w-none lg:self-start">
              <Annotation column={columns[0]} offset={inView ? -10 : 20} />
              <div className="hidden h-px w-[144px] shrink-0 self-start border-t border-dashed border-white/40 lg:my-12 lg:block" />
            </div>
          )}

          {SHOW_ANNOTATIONS && (
            <div className="hidden w-[100px] shrink-0 lg:block" />
          )}

          {SHOW_ANNOTATIONS && columns[1] && (
            <div className="z-10 flex w-full max-w-[320px] items-center lg:-mt-[30px] lg:mb-24 lg:w-[270px] lg:max-w-none lg:self-end">
              <div className="hidden h-px w-[144px] shrink-0 self-center border-t border-dashed border-white/40 lg:mb-12 lg:mt-8 lg:block" />
              <Annotation column={columns[1]} offset={inView ? 10 : -20} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Annotation({ column, offset }) {
  return (
    <div
      className="flex w-full flex-col lg:w-[200px] lg:max-w-[200px]"
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 1000ms ease-out',
      }}
    >
      <h3 className="mb-1 text-[12px] font-medium uppercase leading-[13.2px] text-white">
        {column.title}
      </h3>
      <p className="m-0 text-[12px] leading-[16.8px] text-zinc-400">
        {column.text}
      </p>
    </div>
  );
}

/** Brojač 0 → N (kao na originalu: ~1.2s, ease-out). Ako vrednost nije broj, ispiše se kao tekst. */
function CountUp({ value, active, duration = 1200 }) {
  const target = Number(String(value).replace(/[^\d.-]/g, ''));
  const isNumeric = Number.isFinite(target);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isNumeric || !active) return;

    let frame;
    const start = performance.now();
    const decimals = String(target).split('.')[1]?.length ?? 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((target * eased).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, isNumeric, target, duration]);

  if (!isNumeric) return <>{value}</>;
  return <>{active ? count : 0}</>;
}
