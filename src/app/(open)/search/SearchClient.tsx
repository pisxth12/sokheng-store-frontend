"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/open/products/ProductCard";
import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import ProductCardSkeletonGrid from "@/components/open/loadings/ProductCardSkeletonGrid";
import { useTranslations } from "next-intl";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { publicProductApi } from "@/lib/open/products";
import { Product } from "@/types/open/product.type";

import OffcanvasFilter from "../products/OffcanvasFilter";

interface SearchClientProps {
  initialQuery: string;
  initialProducts: Product[];
  initialTotal: number;
  initialHasMore: boolean;
  currentPage: number;
  limit: number;
  initialFilters: {
    minPrice: string;
    maxPrice: string;
    categoryId: string;
    brandId: string;
    sortBy: string;
    sortOrder: string;
  };
  priceRange: { min: number; max: number };
  categories: { id: number; name: string; slug: string }[];
  brands: { id: number; name: string; slug: string }[];
}

export default function SearchClient({
  initialQuery,
  initialProducts,
  initialTotal,
  initialHasMore,
  currentPage,
  limit,
  initialFilters,
  priceRange,
  categories,
  brands,
}: SearchClientProps) {
  const t = useTranslations("SearchPage");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(currentPage);
  const [total, setTotal] = useState(initialTotal);

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [filters, setFilters] = useState(initialFilters);

  const isInitialMount = useRef(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Mount query
  useEffect(() => {
    setSearchInput(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setProducts(initialProducts);
    setTotal(initialTotal);
    setHasMore(initialHasMore);
    setPage(currentPage);
  }, [initialProducts, initialTotal, initialHasMore, currentPage]);

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

  // Infinite scroll observer
  useEffect(() => {
    if (loading) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMore &&
        !loading &&
        !isInitialMount.current
      ) {
        loadMore();
      }
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await publicProductApi.searchProducts(
        initialQuery,
        nextPage,
        limit,
        filters.sortBy,
        filters.sortOrder,
        filters.minPrice ? Number(filters.minPrice) : undefined,
        filters.maxPrice ? Number(filters.maxPrice) : undefined,
        filters.categoryId ? Number(filters.categoryId) : undefined,
        filters.brandId ? Number(filters.brandId) : undefined
      );

      setProducts((prev) => [...prev, ...response.items]);
      setPage(nextPage);
      setHasMore(response.pagination.hasMore);
      setTotal(response.pagination.total);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark initial mount as done after first render
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchInput.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    console.log("Updating URL with:", params.toString());
    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortBy, sortOrder;

    if (value === "recommend") {
      sortBy = "recommend";
      sortOrder = "desc";
    } else {
      [sortBy, sortOrder] = value.split("-");
    }

    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    updateUrl({ sortBy, sortOrder });
  };

  const handleApplyFilters = (newFilters: any) => {
    setOpenFilterModal(false);
    const updatedFilters = {
      minPrice: newFilters.minPrice || "",
      maxPrice: newFilters.maxPrice || "",
      categoryId: newFilters.categoryId || "",
      brandId: newFilters.brandId || "",
      sortBy: newFilters.sortBy || filters.sortBy,
      sortOrder: newFilters.sortOrder || filters.sortOrder,
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
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mt-40 mx-auto py-8">
        <ProductCardSkeletonGrid count={20} />
      </div>
    );
  }

  return (
    <>
      <div className="sp-page">
        {/* ── Sticky Header ── */}
        <div className={`sp-header ${showHeader ? "" : "sp-header--hidden"}`}>
          {/* Search bar */}
          <div className="sp-search-row ">
            <form onSubmit={handleSearch} className="sp-search-form">
              <Search size={16} className="sp-search-icon" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="sp-search-input"
              />
              <button
                type="submit"
                className="sp-search-btn"
                aria-label="Search"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M7 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Filter + Sort row */}
          <div className="sp-controls-row">
            <button
              className="sp-filter-btn"
              onClick={() => setOpenFilterModal(true)}
            >
              <SlidersHorizontal size={13} />
              {t("filters")}
            </button>

            <select
              className="sp-sort-select"
              value={
                filters.sortBy === "recommend"
                  ? "recommend"
                  : `${filters.sortBy}-${filters.sortOrder}`
              }
              onChange={handleSortChange}
            >
              <option value="recommend">{t("sortOptions.recommend")}</option>
              <option value="createdAt-desc">{t("sortOptions.newest")}</option>
              <option value="createdAt-asc">{t("sortOptions.oldest")}</option>
              <option value="price-asc">{t("sortOptions.priceLowHigh")}</option>
              <option value="price-desc">
                {t("sortOptions.priceHighLow")}
              </option>
            </select>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="sp-content">
          {products.length === 0 && initialQuery ? (
            <div className="sp-empty">
              <Search size={48} className="sp-empty-icon" />
              <h2 className="sp-empty-title">{t("noResults.title")}</h2>
              <p className="sp-empty-sub">
                {t("noResults.message", { query: initialQuery })}
              </p>
              <Link href="/products" className="sp-empty-cta">
                {t("noResults.button")}
              </Link>
            </div>
          ) : products.length === 0 && !initialQuery ? (
            <div className="sp-empty">
              <Search size={48} className="sp-empty-icon" />
              <h2 className="sp-empty-title">Search products</h2>
              <p className="sp-empty-sub">
                Type something to search for products
              </p>
            </div>
          ) : (
            <>
              {initialQuery && (
                <p className="sp-result-meta">
                  <strong>{products.length}</strong> results for &ldquo;
                  {initialQuery}&rdquo;
                </p>
              )}

              <div className="sp-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div ref={loadMoreRef} className="sp-sentinel">
                {loading && (
                  <div className="sp-loading-dots">
                    <span className="sp-loading-dot" />
                    <span className="sp-loading-dot" />
                    <span className="sp-loading-dot" />
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <span className="sp-end-label">End of results</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <OffcanvasFilter
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
      <ScrollToTop />
    </>
  );
}
