import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function CategoryBreadcrumb({ category, currentLabel }) {
  const items = [
    { label: 'Products', href: '/products' },
    { label: currentLabel ?? category.title },
  ];

  return <Breadcrumbs items={items} />;
}
