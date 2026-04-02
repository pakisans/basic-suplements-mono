import { ProductCard } from '@/components/product/ProductCard';

export function CarouselBlock({ block }) {
  const products = block.populatedDocs ?? block.selectedDocs ?? [];
  if (!products.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
