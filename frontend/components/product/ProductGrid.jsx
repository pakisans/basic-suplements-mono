import { ProductCard } from './ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({
  products,
  columns = 4,
  emptyTitle = 'Nema proizvoda',
  emptyDescription = 'Trenutno nema dostupnih proizvoda.',
  className = '',
}) {
  if (!products?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={<Button href="/proizvodi">Pogledaj sve proizvode</Button>}
      />
    );
  }

  return (
    <div
      className={`grid gap-x-4 gap-y-8 ${columnClasses[columns] ?? columnClasses[4]} ${className}`}
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
