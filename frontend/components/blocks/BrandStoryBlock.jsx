import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { RichText } from '@/components/ui/RichText';

function TextContent({
  eyebrow,
  heading,
  description,
  stats,
  cta,
  darkStats,
  textOnImage,
}) {
  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="space-y-5">
        {eyebrow && (
          <p
            className={`text-[10px] font-semibold tracking-[0.4em] uppercase ${textOnImage ? 'text-zinc-400 lg:text-zinc-500' : 'text-zinc-500'}`}
          >
            {eyebrow}
          </p>
        )}
        <h2 className="text-5xl font-extrabold leading-none tracking-tight text-white md:text-6xl">
          {heading}
        </h2>
        <div className="h-px w-12 bg-white/20" />
        {description && (
          <div className="max-w-lg text-[15px] leading-relaxed lg:text-base [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1 [&_p]:text-white lg:[&_p]:text-zinc-400 [&_li]:text-zinc-400 lg:[&_li]:text-zinc-400">
            <RichText content={description} />
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div
          className={`grid grid-cols-2 gap-px ring-1 ring-white/10 ${darkStats ? 'bg-white/8' : 'bg-white/5'}`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1.5 px-6 py-5 ${darkStats ? 'bg-black' : 'bg-black/40 backdrop-blur-sm'}`}
            >
              <span className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                {stat.value}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.3em] text-zinc-400 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {cta?.label && cta?.url && (
        <div>
          <Link
            href={cta.url}
            className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all hover:border-white hover:bg-white hover:text-black"
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
  );
}

export function BrandStoryBlock({ block }) {
  const {
    eyebrow,
    heading,
    description,
    image,
    stats = [],
    layout = 'image-right',
    imageFit = 'cover',
    cta,
  } = block;
  const reverse = layout === 'image-left';

  if (imageFit === 'contain' && image) {
    const imageOnRight = !reverse;
    return (
      <section className="relative bg-black border-t border-white/[0.06] py-28 md:py-40">
        {/* Image — right or left portion, slightly inset vertically */}
        <div
          className={`absolute inset-y-6 md:inset-y-10 ${imageOnRight ? 'right-0 left-0 lg:left-[42%]' : 'left-0 right-0 lg:right-[42%]'} overflow-hidden`}
        >
          <PayloadImage
            media={image}
            fill
            className="object-cover object-center"
          />
          {/* mobile: heavy bottom-to-top overlay so text on top is readable */}
          <div className="absolute inset-0 bg-black/75 lg:hidden" />
          {/* desktop: fade toward text side */}
          <div
            className={`absolute inset-0 hidden lg:block ${imageOnRight ? 'bg-linear-to-r from-zinc-950 via-zinc-950/30 to-transparent' : 'bg-linear-to-l from-zinc-950 via-zinc-950/30 to-transparent'}`}
          />
        </div>


        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex ${imageOnRight ? 'justify-start' : 'justify-end'}`}
          >
            <div className="w-full max-w-xl">
              <TextContent
                eyebrow={eyebrow}
                heading={heading}
                description={description}
                stats={stats}
                cta={cta}
                darkStats={false}
                textOnImage={true}
              />
            </div>
          </div>
        </div>

      </section>
    );
  }

  return (
    <section className="relative bg-black border-t border-white/[0.06] py-24 md:py-32">

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-20 ${reverse ? 'lg:flex-row-reverse' : ''}`}
        >
          <div className="flex flex-1">
            <TextContent
              eyebrow={eyebrow}
              heading={heading}
              description={description}
              stats={stats}
              cta={cta}
              darkStats={true}
            />
          </div>

          <div className="relative flex-1 min-h-105 lg:min-h-0">
            <div className="relative h-full overflow-hidden bg-zinc-900 ring-1 ring-white/10">
              {image ? (
                <>
                  <PayloadImage media={image} fill className="object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px)',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
