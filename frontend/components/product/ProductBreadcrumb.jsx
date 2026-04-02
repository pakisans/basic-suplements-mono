import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { buildProductPath } from '@/services/products';

export function ProductBreadcrumb({ product }) {
  return (
    <Breadcrumbs
      items={[
        { label: 'Proizvodi', href: '/proizvodi' },
        { label: product.title, href: buildProductPath(product) },
      ]}
      className="mb-6"
    />
  );
}
