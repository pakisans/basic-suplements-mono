import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { buildProductPath } from '@/services/products';
import { buildCategoryPath } from '@/services/categories';

export function ProductBreadcrumb({ product }) {
  const categories = product.categories ?? [];
  const primaryCategory =
    categories.length > 0 && typeof categories[0] !== 'string'
      ? categories[0]
      : null;

  const items = [{ label: 'Proizvodi', href: '/proizvodi' }];

  if (primaryCategory) {
    const parent =
      primaryCategory.parent && typeof primaryCategory.parent !== 'string'
        ? primaryCategory.parent
        : null;

    if (parent) {
      items.push({ label: parent.title, href: `/proizvodi/${parent.slug}` });
    }

    items.push({
      label: primaryCategory.title,
      href: buildCategoryPath(primaryCategory),
    });
  }

  items.push({ label: product.title, href: buildProductPath(product) });

  return <Breadcrumbs items={items} className="mb-6" />;
}
