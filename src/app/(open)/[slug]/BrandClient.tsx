"use client"

import { NotFound } from "@/components/open/productDetails/NotFound";
import { ProductGrid } from "@/components/open/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { useBrandProducts } from "@/hooks/open/useBrandProducts";
import { Brand } from "@/types/open/brand.type";
import { PageResponse, Product } from "@/types/open/product.type";
import { useCallback, useEffect, useRef } from "react";

interface BrandClientPageProps{
    brand: Brand;
    slug: string;
    initialData: PageResponse<Product>;
}
export default function BrandClientPage({brand, slug, initialData }: BrandClientPageProps){
    const { products, loading, hasMore, total, error, loadMore, reset } = useBrandProducts(slug, initialData);

    const observerTarget = useRef<HTMLDivElement>(null);
    const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [loadMore, loading, hasMore],
  );

  
  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleObserver]);

  
   if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-primary py-5">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold">
          {brand.name}
        </h2>
        <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
          Showing <span className="font-semibold">{products.length}</span> of{" "}
          <span className="font-semibold">{total}r</span> products
        </p>
      </div>
     
    
      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />

          {/* Observer Target */}
          <div ref={observerTarget} className="h-4 w-full" />

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <NotFound message="Products not found"/>
        </div>
      )}
      <ScrollToTop />
    </div>
  );


}