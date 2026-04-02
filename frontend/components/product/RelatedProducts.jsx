import { Section, SectionHeading } from '@/components/ui/Section';
import { ProductCard } from './ProductCard';

export function RelatedProducts({ products, title = 'Slični proizvodi' }) {
  if (!products?.length) return null;

  return (
    <Section className="border-t border-zinc-900">
      <SectionHeading title={title} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  );
}
