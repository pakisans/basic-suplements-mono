import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { CatalogModeProvider } from '@/components/catalog/CatalogModeProvider';
import { CountryGate } from '@/components/catalog/CountryGate';
import { getHeader, getFooter } from '@/services/globals';
import { SITE_NAME, SITE_DESCRIPTION, SERVER_URL } from '@/constants';
import { organizationJsonLd } from '@/lib/seo/metadata';

export const metadata = {
  metadataBase: new URL(SERVER_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
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
