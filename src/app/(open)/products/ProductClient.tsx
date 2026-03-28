// src/app/products/ProductsClient.tsx
"use client";

import { ProductGrid } from "@/components/open/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { publicProductApi } from "@/lib/open/products";
import {
  Product,
  FilterState,
  PriceRange,
  Category,
  Brand,
} from "@/types/open/product.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import FfcanvasFilter from "./OffcanvasFilter";
import "./ProductsPage.css";

interface ProductsClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialHasMore: boolean;
  currentPage: number;
  limit: number;
  initialFilters: FilterState;
  priceRange: PriceRange;
  initialCategories: Category[];
  initialBrands: Brand[];
}

export default function ProductsClient({
  initialProducts,
  initialTotal,
  initialHasMore,
  currentPage,
  limit,
  initialFilters,
  priceRange,
  initialCategories,
  initialBrands,
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
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync props after router.refresh()
  useEffect(() => {
    setProducts(initialProducts);
    setTotal(initialTotal);
    setHasMore(initialHasMore);
    setPage(currentPage);
    setFilters(initialFilters);
  }, [
    initialProducts,
    initialTotal,
    initialHasMore,
    currentPage,
    initialFilters,
  ]);

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
        filters.brandId ? Number(filters.brandId) : undefined,
      );

      setProducts((prev) => [...prev, ...response.items]);
      setPage(nextPage);
      setHasMore(response.pagination.hasMore);
      setTotal(response.pagination.total);
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
  const updateUrl = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "" && value !== "0") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "0");
      router.push(`/products?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams],
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      let sortBy: string, sortOrder: string;

      if (value === "recommend") {
        sortBy = "recommend";
        sortOrder = "desc";
      } else {
        [sortBy, sortOrder] = value.split("-");
      }

      setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
      updateUrl({ sortBy, sortOrder });
    },
    [updateUrl],
  );

  // Handle filter apply
  const handleApplyFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
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
    },
    [filters, updateUrl],
  );

  const reset = useCallback(() => {
    setError(null);
    setProducts(initialProducts);
    setPage(currentPage);
    setHasMore(initialHasMore);
  }, [initialProducts, currentPage, initialHasMore]);

  if (error) {
    return (
      <div className="mx-auto px-4 py-16 text-center">
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
      <div className="pp-page ">
        {/* Sticky Header with Filters */}
        <div className={`pp-header ${showHeader ? "" : "pp-header--hidden"}`}>
          {/* Filter + Sort row */}
          <div className="pp-controls-row">
            <button
              className="pp-filter-btn"
              onClick={() => setOpenFilterModal(true)}
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>

            <select
              className="pp-sort-select"
              value={
                filters.sortBy === "recommend"
                  ? "recommend"
                  : `${filters.sortBy}-${filters.sortOrder}`
              }
              onChange={handleSortChange}
            >
              <option value="recommend">Recommended</option>
              <option value="createdAt-desc">Newest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Header with count */}
        <div className="pp-header-count">
          <h1 className="pp-title">All Products</h1>
          <p className="pp-count">
            Showing <span>{products.length}</span> of <span>{total}</span>{" "}
            products
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <div ref={observerTarget} className="pp-sentinel" />
            {loading && (
              <div className="pp-loading">
                <div className="pp-loading-dots">
                  <span className="pp-loading-dot" />
                  <span className="pp-loading-dot" />
                  <span className="pp-loading-dot" />
                </div>
              </div>
            )}
            {!hasMore && products.length > 0 && (
              <p className="pp-end-label">End of results</p>
            )}
          </>
        ) : (
          <div className="pp-empty">
            <p>No products found</p>
          </div>
        )}
        <ScrollToTop />
      </div>

      <FfcanvasFilter
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        showCategoryFilter={true}
        showBrandFilter={true}
      />
    </>
  );
}
