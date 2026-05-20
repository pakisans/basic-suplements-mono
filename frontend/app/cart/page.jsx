export const dynamic = 'force-dynamic';
import { CartPage } from '@/components/cart/CartPage';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Cart',
  description: 'Review your selected items and continue to checkout.',
  canonical: '/cart',
});

export default function CartRoutePage() {
  return <CartPage />;
}
