import { RichText } from '@/components/ui/RichText';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export function ArchiveBlock({ block }) {
  const products = block.populatedDocs ?? block.selectedDocs ?? [];

  return (
    <div>
      {block.introContent && (
        <div className="mb-8">
          <RichText content={block.introContent} />
        </div>
      )}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-zinc-600">
          Nema proizvoda za prikaz.
        </div>
      )}
      <div className="mt-10 text-center">
        <Button href="/proizvodi" variant="outline">
          Pogledaj sve proizvode
        </Button>
      </div>
    </div>
  );
}
