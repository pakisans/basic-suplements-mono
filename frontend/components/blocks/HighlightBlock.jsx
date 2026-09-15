import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';

/**
 * Highlight — struktura preuzeta sa seed.com "HighlightSection", paleta je NAŠA
 * (crna tema): tamni panel sa zaobljenim gornjim uglovima, levo badge + naslov +
 * tekst + CTA, desno grid od jedne velike i tri male slike.
 *
 * Geometrija je 1:1 sa originalom (izmereno sa seed.com):
 *   sekcija   radius 32px 32px 0 0, padding 80px 32px
 *   grid      12 kolona / gap 32px — tekst span 6 (vertikalno centriran), slike span 6
 *   badge     pill, 12px / 500
 *   naslov    40px / 44px, weight 350, letter-spacing -0.4px, margin-top 24px
 *   body      16px / 20.8px, margin-top 24px
 *   CTA       pill, padding 16px 24px, margin-top 24px
 *   slike     grid 6 kolona / gap 16px; velika 1/-1 (704×396), tri male span 2 (224×196), radius 16px
 *
 * Boje su prilagođene tamnoj temi sajta: panel zinc-950 na crnoj pozadini,
 * naslov bel, tekst zinc-400, CTA belo dugme sa crnim tekstom.
 */
/**
 * Okvir glavne slike se prilagođava formatu fajla, a ne obrnuto:
 *   - pejzaž do 16:9 → okvir tačno prati format slike, pa `cover` ništa ne odseca
 *   - širi od 16:9 → okvir ostaje 16:9 (minimalno seče stranice)
 *   - kvadrat i sve uspravnije → okvir je kvadrat, i dodatno se ograniči na 560px
 *     da ne razvuče celu sekciju u visinu
 *   - uspravna slika (ratio < 1) ide `contain` sa malo padinga, da se proizvod
 *     vidi ceo (bočne trake na tamnoj podlozi umesto odsečene glave/dna)
 *   - ako medij nema dimenzije (ručno unet URL) → 16:9 + `cover`, kao pre
 */
const MAX_RATIO = 16 / 9;

function mainFrame(media) {
  const w = typeof media === 'object' ? media?.width : null;
  const h = typeof media === 'object' ? media?.height : null;
  const ratio = w && h ? w / h : null;

  if (!ratio) return { aspectRatio: '16 / 9', fit: 'cover', narrow: false };

  const frame = Math.min(Math.max(ratio, 1), MAX_RATIO);
  return {
    aspectRatio: String(frame),
    fit: ratio < 1 ? 'contain' : 'cover',
    narrow: frame < 1.25,
  };
}

export function HighlightBlock({ block }) {
  const main = block?.mainImage;
  if (!main) return null;

  const gallery = (block.gallery ?? [])
    .map((g) => g?.image)
    .filter(Boolean)
    .slice(0, 3);
  const imagesLeft = block.variant === 'left';
  const cta = block.cta || {};
  const frame = mainFrame(main);

  // Male pločice dele jedan odnos (da red ostane poravnat): najuspravnija slika
  // diktira okvir, u granicama kvadrat … 8/7. Uspravne idu `contain`.
  const tileRatios = gallery
    .map((g) => (typeof g === 'object' && g?.width && g?.height ? g.width / g.height : null))
    .filter(Boolean);
  const tileAspect = tileRatios.length
    ? Math.min(Math.max(Math.min(...tileRatios), 1), 8 / 7)
    : 8 / 7;

  return (
    <section
      aria-label={block.heading || 'Highlight'}
      className="relative rounded-t-[32px] bg-zinc-950 px-6 py-16 text-white md:px-8 md:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Tekst */}
          <div
            className={`self-center md:col-span-6 ${
              imagesLeft ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'
            }`}
          >
            {block.badge && (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[12px] font-medium leading-[12px] text-white">
                {block.badge}
              </span>
            )}

            <h2
              className="mt-6 text-[32px] leading-[36px] tracking-[-0.4px] text-white md:text-[40px] md:leading-[44px]"
              style={{ fontWeight: 350 }}
            >
              {block.heading}
            </h2>

            {block.body && (
              <p className="mt-6 max-w-[36rem] text-[16px] leading-[1.3] text-zinc-400">
                {block.body}
              </p>
            )}

            {cta.label && (
              <Link
                href={cta.url || '/proizvodi'}
                className="group mt-6 inline-flex items-center rounded-full bg-white px-6 py-4 text-[16px] font-medium leading-[19px] text-black transition-colors hover:bg-zinc-200"
              >
                {cta.label}
                <span
                  aria-hidden="true"
                  className="ml-0 w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:w-3 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 1.5 10.5 6 6 10.5 5 9.5l2.6-2.6H1.5v-1.8h6.1L5 2.5 6 1.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </Link>
            )}
          </div>

          {/* Slike */}
          <div className={`md:col-span-6 ${imagesLeft ? 'md:order-1' : 'md:order-2'}`}>
            <div className="grid grid-cols-6 gap-3 md:gap-4">
              <div
                className={`relative col-span-6 mx-auto w-full overflow-hidden rounded-2xl bg-zinc-900 ${
                  frame.narrow ? 'max-w-[560px]' : ''
                } ${frame.fit === 'contain' ? 'p-4 md:p-6' : ''}`}
                style={{ aspectRatio: frame.aspectRatio }}
              >
                <PayloadImage
                  media={main}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 704px"
                  style={{ objectFit: frame.fit }}
                />
              </div>

              {gallery.map((img, i) => {
                const r =
                  typeof img === 'object' && img?.width && img?.height
                    ? img.width / img.height
                    : null;
                const fit = r !== null && r < 1 ? 'contain' : 'cover';

                return (
                  <div
                    key={img?.id ?? i}
                    className={`relative col-span-2 overflow-hidden rounded-2xl bg-zinc-900 ${
                      fit === 'contain' ? 'p-2' : ''
                    }`}
                    style={{ aspectRatio: String(tileAspect) }}
                  >
                    <PayloadImage
                      media={img}
                      fill
                      sizes="(max-width: 768px) 33vw, 17vw"
                      style={{ objectFit: fit }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
