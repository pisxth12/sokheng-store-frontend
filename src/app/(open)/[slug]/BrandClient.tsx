// app/(open)/[slug]/BrandClient.tsx
"use client";

import { ProductGrid } from "@/components/open/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { publicProductApi } from "@/lib/open/products";
import { Product, FilterState, Category, ProductsWithPriceRangeResponse } from "@/types/open/product.type";
import { Brand } from "@/types/open/brand.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import OffcanvasFilter from "../products/OffcanvasFilter";
import "./BrandPage.css";

interface BrandClientProps {
  brand: Brand;
  initialData: ProductsWithPriceRangeResponse;
  initialFilters: FilterState;
  categories: Category[];
}

export default function BrandClient({ brand, initialData, initialFilters, categories }: BrandClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialData.items);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.pagination.hasMore);
  const [page, setPage] = useState(initialData.pagination.page);
  const [total, setTotal] = useState(initialData.pagination.total);
  const [priceRange, setPriceRange] = useState(initialData.filters);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProducts(initialData.items);
    setTotal(initialData.pagination.total);
    setHasMore(initialData.pagination.hasMore);
    setPage(initialData.pagination.page);
    setPriceRange(initialData.filters);
    setFilters(initialFilters);
  }, [initialData, initialFilters]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowHeader(y <= lastScrollY || y <= 10);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await publicProductApi.getProductsByBrandWithFilters(brand.slug, {
        page: nextPage,
        size: 32,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
      });
      setProducts(prev => [...prev, ...response.items]);
      setPage(nextPage);
      setHasMore(response.pagination.hasMore);
      setTotal(response.pagination.total);
      setPriceRange(response.filters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters, brand.slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) loadMore();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const updateUrl = useCallback((updates: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== "0") params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "0");
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  }, [router, searchParams, pathname]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleApplyFilters = (newFilters: Partial<FilterState>) => {
    setOpenFilterModal(false);
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateUrl({
      minPrice: updatedFilters.minPrice,
      maxPrice: updatedFilters.maxPrice,
      categoryId: updatedFilters.categoryId,
      sortBy: updatedFilters.sortBy,
      sortOrder: updatedFilters.sortOrder,
    });
  };

  const clearFilters = () => {
    updateUrl({
      sortBy: "createdAt", sortOrder: "desc", minPrice: "", maxPrice: "", categoryId: "",
    });
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.categoryId ||
    filters.sortBy !== "createdAt" || filters.sortOrder !== "desc";

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <div className="bp-page">
      {/* Sticky Header */}
      <div className={`bp-header ${showHeader ? "" : "bp-header--hidden"}`}>
        <div className="bp-controls-row">
          <button className="bp-filter-btn" onClick={() => setOpenFilterModal(true)}>
            <SlidersHorizontal size={13} />
            Filters
            {hasActiveFilters && <span className="bp-active-dot" />}
          </button>
          <select
            className="bp-sort-select"
            value={filters.sortBy === "recommend" ? "recommend" : `${filters.sortBy}-${filters.sortOrder}`}
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
      <div className="bp-header-count">
        <h1 className="bp-title uppercase">{brand.name}</h1>
        <p className="bp-count">
          Showing <span>{products.length}</span> of <span>{total}</span> products
          {hasActiveFilters && (
            <button onClick={clearFilters} className="bp-clear-filters">
              Clear all filters
            </button>
          )}
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          <div ref={observerTarget} className="bp-sentinel" />
          {loading && (
            <div className="bp-loading">
              <div className="bp-loading-dots">
                <span className="bp-loading-dot" />
                <span className="bp-loading-dot" />
                <span className="bp-loading-dot" />
              </div>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <p className="bp-end-label">End of results</p>
          )}
        </>
      ) : (
        <div className="bp-empty">
          <p>No products found</p>
        </div>
      )}

      <ScrollToTop />

      <OffcanvasFilter
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        categories={categories}
        brands={[]}
        priceRange={{ min: priceRange.minPrice, max: priceRange.maxPrice }}
        showCategoryFilter={true}
        showBrandFilter={false}
      />
    </div>
  );
}