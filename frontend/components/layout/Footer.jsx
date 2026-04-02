import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { RichText } from '@/components/ui/RichText';
import { resolveLink } from '@/components/ui/Button';
import { SOCIAL_PLATFORMS } from '@/constants';

export function Footer({ footer }) {
  const sections = footer?.sections ?? [];
  const bottomBar = footer?.bottomBar;

  return (
    <footer className="bg-zinc-950 text-zinc-300" role="contentinfo">
      {sections.length > 0 ? (
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {sections.map((section, i) => (
              <FooterSection key={i} section={section} />
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-white">Prodavnica</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/proizvodi" className="hover:text-white">
                    Svi proizvodi
                  </Link>
                </li>
                <li>
                  <Link href="/brendovi" className="hover:text-white">
                    Brendovi
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-zinc-500 md:flex-row">
            <div>
              {bottomBar?.copyright ??
                `© ${new Date().getFullYear()} Prodavnica. Sva prava zadržana.`}
            </div>
            {bottomBar?.legalLinks?.length > 0 && (
              <div className="flex gap-4">
                {bottomBar.legalLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url ?? '#'}
                    className="hover:text-zinc-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ section }) {
  switch (section.blockType) {
    case 'footerBrand':
      return (
        <div className="lg:col-span-1">
          {section.logo && (
            <div className="mb-4">
              <PayloadImage
                media={section.logo}
                width={120}
                height={40}
                alt="Logo"
              />
            </div>
          )}
          {section.tagline && (
            <p className="mb-2 font-semibold text-white">{section.tagline}</p>
          )}
          {section.description && (
            <p className="text-sm leading-relaxed text-zinc-400">
              {section.description}
            </p>
          )}
        </div>
      );

    case 'footerColumn':
      return (
        <div>
          <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
          <ul className="space-y-2">
            {(section.links ?? []).map((item, i) => (
              <li key={i}>
                <Link
                  href={resolveLink(item.link)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  {item.link?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'footerText':
      return (
        <div>
          {section.title && (
            <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
          )}
          <div className="text-sm text-zinc-400">
            <RichText content={section.content} />
          </div>
        </div>
      );

    case 'footerContact':
      return (
        <div>
          {section.title && (
            <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
          )}
          <ul className="space-y-2 text-sm text-zinc-400">
            {section.phone && (
              <li>
                <a href={`tel:${section.phone}`}>{section.phone}</a>
              </li>
            )}
            {section.email && (
              <li>
                <a href={`mailto:${section.email}`}>{section.email}</a>
              </li>
            )}
            {section.address && <li>{section.address}</li>}
            {section.workingHours && (
              <li className="text-zinc-500">{section.workingHours}</li>
            )}
          </ul>
        </div>
      );

    case 'footerSocial':
      return (
        <div>
          {section.title && (
            <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
          )}
          <div className="flex flex-wrap gap-3">
            {(section.profiles ?? []).map((profile, i) => (
              <a
                key={i}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-white"
              >
                {SOCIAL_PLATFORMS[profile.platform]?.label ?? profile.platform}
              </a>
            ))}
          </div>
        </div>
      );

    case 'footerNewsletter':
      return (
        <div>
          <h3 className="mb-2 font-semibold text-white">{section.heading}</h3>
          {section.description && (
            <p className="mb-4 text-sm text-zinc-400">{section.description}</p>
          )}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Vaša e-mail adresa"
              className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
            />
            <button
              type="button"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900"
            >
              {section.buttonLabel ?? 'Prijavi se'}
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
