// src/app/products/ProductsClient.tsx
"use client";

import { ProductGrid } from "@/components/open/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { publicProductApi } from "@/lib/open/products";
import { Product, FilterState, PriceRange, Category, Brand } from "@/types/open/product.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import FilterModal from "./FiterModal";

interface ProductsClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialHasMore: boolean;
  currentPage: number;
  limit: number;
  initialFilters: FilterState;
  priceRange: PriceRange;
}

export default function ProductsClient({ 
  initialProducts, 
  initialTotal,
  initialHasMore,
  currentPage,
  limit,
  initialFilters,
  priceRange
}: ProductsClientProps) {
  const t = useTranslations("ProductsPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(currentPage);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(null);
  
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch categories and brands for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          publicProductApi.getCategoryNames(),
          publicProductApi.getBrandNames()
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };
    fetchFilterData();
  }, []);

  // Sync props after router.refresh()
  useEffect(() => {
    setProducts(initialProducts);
    setTotal(initialTotal);
    setHasMore(initialHasMore);
    setPage(currentPage);
    setFilters(initialFilters);
  }, [initialProducts, initialTotal, initialHasMore, currentPage, initialFilters]);

  // Handle scroll header
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowHeader(y <= lastScrollY || y <= 10);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  // Load more products for infinite scroll
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await publicProductApi.getAllProductsFilter(
        nextPage, 
        limit,
        filters.sortBy,
        filters.sortOrder,
        filters.minPrice ? Number(filters.minPrice) : undefined,
        filters.maxPrice ? Number(filters.maxPrice) : undefined,
        filters.categoryId ? Number(filters.categoryId) : undefined,
        filters.brandId ? Number(filters.brandId) : undefined
      );

      setProducts(prev => [...prev, ...response.products.content]);
      setPage(nextPage);
      setHasMore(response.hasMore);
      setTotal(response.products.totalElements);
    } catch (err) {
      setError("Failed to load more products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit, filters]);

  // Intersection Observer for infinite scroll
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

  // Update URL with filters and refresh
  const updateUrl = useCallback((updates: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== "0") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "0");
    router.push(`/all-products?${params.toString()}`);
    router.refresh();
  }, [router, searchParams]);

  // Handle sort change
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortBy: string, sortOrder: string;
    
    if (value === "recommend") {
      sortBy = "recommend";
      sortOrder = "desc";
    } else {
      [sortBy, sortOrder] = value.split("-");
    }
    
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    updateUrl({ sortBy, sortOrder });
  }, [updateUrl]);

  // Handle filter apply
  const handleApplyFilters = useCallback((newFilters: Partial<FilterState>) => {
    setOpenFilterModal(false);
    const updatedFilters: FilterState = {
      ...filters,
      ...newFilters,
    };
    setFilters(updatedFilters);
    
    updateUrl({
      minPrice: updatedFilters.minPrice,
      maxPrice: updatedFilters.maxPrice,
      categoryId: updatedFilters.categoryId,
      brandId: updatedFilters.brandId,
      sortBy: updatedFilters.sortBy,
      sortOrder: updatedFilters.sortOrder,
    });
  }, [filters, updateUrl]);

  const reset = useCallback(() => {
    setError(null);
    setProducts(initialProducts);
    setPage(currentPage);
    setHasMore(initialHasMore);
  }, [initialProducts, currentPage, initialHasMore]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">{error}</p>
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
    <>
      <div className="mx-auto max-w-primary py-8">
        {/* Sticky Header with Filters */}
        <div className={`sticky top-0 z-40 bg-white dark:bg-black pb-4 transition-transform duration-300 ${showHeader ? "" : "-translate-y-full"}`}>
          
          {/* Filter + Sort row */}
          <div className="flex justify-between items-center gap-3 mb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              onClick={() => setOpenFilterModal(true)}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <select
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-sm cursor-pointer"
              value={
                filters.sortBy === "recommend"
                  ? "recommend"
                  : `${filters.sortBy}-${filters.sortOrder}`
              }
              onChange={handleSortChange}
            >
              {/* <option value="recommend">Recommended</option> */}
              <option value="createdAt-desc">Newest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Header with count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-4">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            Showing <span className="font-semibold">{products.length}</span> of{" "}
            <span className="font-semibold">{total}</span> products
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

            {/* End Message */}
            {!hasMore && products.length > 0 && (
              <p className="text-center text-gray-500 py-8">
                🎉 You've viewed all {total} products
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
        <ScrollToTop />
      </div>

      <FilterModal
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        categories={categories}
        brands={brands}
        priceRange={priceRange}
      />
    </>
  );
}