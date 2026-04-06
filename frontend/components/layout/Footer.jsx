import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { RichText } from '@/components/ui/RichText';
import { resolveLink } from '@/components/ui/Button';

// ─── Social SVG icons ────────────────────────────────────────────────────────

const SOCIAL_ICONS = {
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="#000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
};

// ─── Block renderers ─────────────────────────────────────────────────────────

function BrandSection({ section, fallbackLogo }) {
  const logo = section?.logo ?? fallbackLogo;
  return (
    <div className="flex flex-col gap-4">
      {logo && (
        <div className="w-fit">
          <PayloadImage
            media={logo}
            width={320}
            height={110}
            className="w-auto object-contain"
          />
        </div>
      )}
      {section?.tagline && (
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500">
          {section.tagline}
        </p>
      )}
      {section?.description && (
        <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
          {section.description}
        </p>
      )}
    </div>
  );
}

function ColumnSection({ section }) {
  return (
    <div>
      {section.title && (
        <p className="mb-5 text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
          {section.title}
        </p>
      )}
      <ul className="space-y-3">
        {(section.links ?? []).map((item, i) => (
          <li key={i}>
            <Link
              href={resolveLink(item.link) ?? '#'}
              className="text-sm text-zinc-500 transition-colors duration-150 hover:text-white"
            >
              {item.link?.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextSection({ section }) {
  return (
    <div>
      {section.title && (
        <p className="mb-5 text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
          {section.title}
        </p>
      )}
      <div className="text-sm leading-relaxed text-zinc-500">
        <RichText content={section.content} />
      </div>
    </div>
  );
}

function ContactSection({ section }) {
  return (
    <div>
      {section.title && (
        <p className="mb-5 text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
          {section.title}
        </p>
      )}
      <ul className="space-y-3 text-sm text-zinc-500">
        {section.phone && (
          <li>
            <a
              href={`tel:${section.phone}`}
              className="transition-colors hover:text-white"
            >
              {section.phone}
            </a>
          </li>
        )}
        {section.email && (
          <li>
            <a
              href={`mailto:${section.email}`}
              className="transition-colors hover:text-white"
            >
              {section.email}
            </a>
          </li>
        )}
        {section.address && (
          <li className="leading-relaxed">{section.address}</li>
        )}
        {section.workingHours && (
          <li className="text-zinc-600">{section.workingHours}</li>
        )}
      </ul>
    </div>
  );
}

function SocialSection({ section }) {
  return (
    <div>
      {section.title && (
        <p className="mb-5 text-[10px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
          {section.title}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {(section.profiles ?? []).map((profile, i) => (
          <a
            key={i}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={profile.platform}
            className="flex h-9 w-9 items-center justify-center border border-zinc-800 text-zinc-500 transition-all duration-150 hover:border-zinc-600 hover:text-white"
          >
            {SOCIAL_ICONS[profile.platform] ?? (
              <span className="text-[10px] uppercase">
                {profile.platform.slice(0, 2)}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function NewsletterSection({ section }) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-white">{section.heading}</p>
      {section.description && (
        <p className="mb-4 text-xs leading-relaxed text-zinc-500">
          {section.description}
        </p>
      )}
      <div className="flex">
        <input
          type="email"
          placeholder="Vaša e-mail adresa"
          className="h-10 min-w-0 flex-1 border border-zinc-800 bg-zinc-950 px-3 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none"
        />
        <button
          type="button"
          className="h-10 shrink-0 border border-l-0 border-zinc-800 bg-zinc-900 px-4 text-xs font-medium tracking-widest text-zinc-300 uppercase transition-colors hover:bg-zinc-800 hover:text-white"
        >
          {section.buttonLabel ?? 'OK'}
        </button>
      </div>
      {section.privacyNote && (
        <p className="mt-2 text-[10px] text-zinc-700">{section.privacyNote}</p>
      )}
    </div>
  );
}

function renderSection(section, i, fallbackLogo) {
  switch (section.blockType) {
    case 'footerBrand':
      return (
        <BrandSection key={i} section={section} fallbackLogo={fallbackLogo} />
      );
    case 'footerColumn':
      return <ColumnSection key={i} section={section} />;
    case 'footerText':
      return <TextSection key={i} section={section} />;
    case 'footerContact':
      return <ContactSection key={i} section={section} />;
    case 'footerSocial':
      return <SocialSection key={i} section={section} />;
    case 'footerNewsletter':
      return <NewsletterSection key={i} section={section} />;
    default:
      return null;
  }
}

// ─── Main Footer ─────────────────────────────────────────────────────────────

export function Footer({ footer }) {
  const sections = footer?.sections ?? [];
  const bottomBar = footer?.bottomBar;
  const topLogo = footer?.logo;

  // Split brand section from the rest so we can give it wider column
  const brandSection = sections.find((s) => s.blockType === 'footerBrand');
  const otherSections = sections.filter((s) => s.blockType !== 'footerBrand');

  // If we have a logo but no footerBrand block, show logo standalone
  const showStandaloneLogo = topLogo && !brandSection;

  const hasSections = sections.length > 0 || showStandaloneLogo;

  return (
    <footer className="border-t border-zinc-900 bg-black" role="contentinfo">
      {hasSections && (
        <div className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div
            className={`grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-12 ${
              brandSection || showStandaloneLogo
                ? 'lg:grid-cols-[2fr_repeat(var(--cols),1fr)]'
                : 'lg:grid-cols-[repeat(var(--cols),1fr)]'
            }`}
            style={{ '--cols': otherSections.length || 1 }}
          >
            {/* Brand / logo block */}
            {brandSection && (
              <BrandSection section={brandSection} fallbackLogo={topLogo} />
            )}
            {showStandaloneLogo && (
              <div className="flex flex-col gap-4">
                <div className="w-fit">
                  <PayloadImage
                    media={topLogo}
                    width={320}
                    height={110}
                    className="w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* All other sections */}
            {otherSections.map((section, i) =>
              renderSection(section, i, topLogo),
            )}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-xs text-zinc-600">
              {bottomBar?.copyright ??
                `© ${new Date().getFullYear()} Basic Supplements. Sva prava zadržana.`}
            </p>

            {bottomBar?.legalLinks?.length > 0 && (
              <nav className="flex items-center gap-5">
                {bottomBar.legalLinks.map((item, i) => {
                  const href = item.link?.url ?? item.url ?? '#';
                  const label = item.link?.label ?? item.label;
                  return (
                    <a
                      key={i}
                      href={href}
                      className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
                    >
                      {label}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
