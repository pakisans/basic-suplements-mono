import { ProductCard } from '@/components/product/ProductCard';

export function ThreeItemGridBlock({ block }) {
  const products = block.products ?? [];
  if (!products.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {products.slice(0, 3).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
