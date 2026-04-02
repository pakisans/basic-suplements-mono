export const dynamic = 'force-dynamic';
import { CartPage } from '@/components/cart/CartPage';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Korpa',
  description: 'Pregled izabranih artikala i priprema za nastavak kupovine.',
  canonical: '/korpa',
});

export default function CartRoutePage() {
  return <CartPage />;
}
