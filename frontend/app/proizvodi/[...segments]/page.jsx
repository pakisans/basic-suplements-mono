import { notFound } from 'next/navigation';
import { getCategoryBySlug, getSubcategories } from '@/services/categories';
import { getProductBySlug, getProductsByCategory } from '@/services/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductBreadcrumb } from '@/components/product/ProductBreadcrumb';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductExperience } from '@/components/product/ProductExperience';
import { CategoryCard } from '@/components/category/CategoryCard';
import { CategoryBreadcrumb } from '@/components/category/CategoryBreadcrumb';
import { Pagination } from '@/components/ui/Pagination';
import { ProductSort } from '@/components/product/ProductSort';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import {
  buildCategoryMetadata,
  buildProductMetadata,
  productJsonLd,
  breadcrumbJsonLd,
  getMediaUrl,
} from '@/lib/seo/metadata';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export async function generateMetadata({ params }) {
  const { segments } = await params;
  const [seg1, seg2, seg3] = segments;

  if (segments.length === 3) {
    const product = await getProductBySlug(seg3);
    if (product) {
      return buildProductMetadata({
        title: product.title,
        description: undefined,
        image: product.gallery?.[0]?.image ?? null,
        price: product.price,
        slug: segments.join('/'),
        meta: product.meta,
      });
    }
  }

  if (segments.length === 2) {
    const subcategory = await getCategoryBySlug(seg2);
    if (subcategory) {
      return buildCategoryMetadata({
        title: subcategory.title,
        description: subcategory.description,
        image: subcategory.image ?? null,
        path: segments.join('/'),
        seo: subcategory.seo,
      });
    }

    const product = await getProductBySlug(seg2);
    if (product) {
      return buildProductMetadata({
        title: product.title,
        image: product.gallery?.[0]?.image ?? null,
        price: product.price,
        slug: segments.join('/'),
        meta: product.meta,
      });
    }
  }

  if (segments.length === 1) {
    const category = await getCategoryBySlug(seg1);
    if (category) {
      return buildCategoryMetadata({
        title: category.title,
        description: category.description,
        image: category.image ?? null,
        path: seg1,
        seo: category.seo,
      });
    }
  }

  return {};
}

export default async function ProductsSegmentPage({ params, searchParams }) {
  const { segments } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.stranica ?? '1');
  const sort = sp.sortiranje ?? '-createdAt';
  const [seg1, seg2, seg3] = segments;

  if (segments.length === 3) {
    const product = await getProductBySlug(seg3);
    if (product) return <ProductPage product={product} />;
    notFound();
  }

  if (segments.length === 2) {
    const [subcategory, product] = await Promise.all([
      getCategoryBySlug(seg2),
      getProductBySlug(seg2),
    ]);

    if (subcategory)
      return <CategoryPage category={subcategory} page={page} sort={sort} />;
    if (product) return <ProductPage product={product} />;
    notFound();
  }

  if (segments.length === 1) {
    const category = await getCategoryBySlug(seg1);
    if (!category) notFound();
    return <CategoryPage category={category} page={page} sort={sort} />;
  }

  notFound();
}

async function ProductPage({ product }) {
  const relatedProducts = product.relatedProducts ?? [];
  const brand = product.brand;
  const brandName =
    brand && typeof brand !== 'string' ? brand.title : undefined;
  const primaryImage = product.gallery?.[0]?.image;
  const imageUrl = getMediaUrl(primaryImage ?? null);

  const productBreadcrumbItems = [
    { name: 'Početna', url: '/' },
    { name: 'Proizvodi', url: '/proizvodi' },
    { name: product.title, url: '' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: productJsonLd({
            name: product.title,
            image: imageUrl,
            price: product.price,
            brand: brandName,
            url: `/proizvodi/${product.slug}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd(productBreadcrumbItems),
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductBreadcrumb product={product} />
        <ProductExperience product={product} />

        {product.layout && product.layout.length > 0 && (
          <div className="mt-20 border-t border-zinc-900 pt-16">
            <BlockRenderer blocks={product.layout} />
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </>
  );
}

async function CategoryPage({ category, page, sort }) {
  const [productsData, subcategories] = await Promise.all([
    getProductsByCategory(
      category.slug,
      { page, limit: DEFAULT_PAGE_SIZE },
      sort,
    ),
    getSubcategories(category.slug),
  ]);

  return (
    <>
      <div className="border-b border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <CategoryBreadcrumb category={category} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-zinc-400">
              {category.description}
            </p>
          )}
          <p className="mt-3 text-xs text-zinc-600">
            {productsData.totalDocs} proizvoda
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-5 text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Potkategorije
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {subcategories.map((sub) => (
                <CategoryCard key={sub.id} category={sub} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-zinc-600">
            {productsData.totalDocs} proizvoda
          </p>
          <ProductSort />
        </div>

        <ProductGrid
          products={productsData.docs}
          columns={4}
          emptyTitle="Nema proizvoda u ovoj kategoriji"
          emptyDescription="Probajte drugu kategoriju ili pregledajte sve proizvode."
        />

        <Pagination
          currentPage={productsData.page}
          totalPages={productsData.totalPages}
          className="mt-12"
        />

        {category.layout && category.layout.length > 0 && (
          <div className="mt-20 border-t border-zinc-900 pt-16">
            <BlockRenderer blocks={category.layout} />
          </div>
        )}
      </div>
    </>
  );
}
