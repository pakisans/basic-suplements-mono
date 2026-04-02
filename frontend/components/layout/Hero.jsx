import { PayloadImage } from '@/components/ui/PayloadImage';
import { RichText } from '@/components/ui/RichText';
import { LinkButton } from '@/components/ui/Button';

export function Hero({ hero }) {
  if (!hero || hero.type === 'none') return null;

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      {hero.media && (
        <div className="absolute inset-0 opacity-30">
          <PayloadImage
            media={hero.media}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="relative container mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 md:py-36">
        {hero.richText && (
          <div className="max-w-3xl [&_h1]:text-5xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-tight md:[&_h1]:text-7xl [&_p]:mt-5 [&_p]:text-lg [&_p]:text-zinc-300">
            <RichText content={hero.richText} />
          </div>
        )}
        {hero.links?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-4">
            {hero.links.map((link, index) => (
              <LinkButton key={index} link={link} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
