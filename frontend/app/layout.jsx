import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { CatalogModeProvider } from '@/components/catalog/CatalogModeProvider';
import { CountryGate } from '@/components/catalog/CountryGate';
import { getHeader, getFooter } from '@/services/globals';
import { SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE, SERVER_URL } from '@/constants';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/metadata';

export const metadata = {
  metadataBase: new URL(SERVER_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: SITE_LOCALE,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basicsupplements',
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({ children }) {
  const [header, footer] = await Promise.all([getHeader(), getFooter()]);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteJsonLd() }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <CatalogModeProvider>
          <AuthProvider>
            <CartProvider>
              <CountryGate />
              <Header header={header} />
              <main className="flex-1">{children}</main>
              <Footer footer={footer} />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </CatalogModeProvider>
      </body>
    </html>
  );
}
