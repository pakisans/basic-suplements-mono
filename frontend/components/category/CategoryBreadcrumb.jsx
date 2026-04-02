import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function CategoryBreadcrumb({ category, currentLabel }) {
  const items = [
    { label: 'Proizvodi', href: '/proizvodi' },
    { label: currentLabel ?? category.title },
  ];

  return <Breadcrumbs items={items} />;
}
