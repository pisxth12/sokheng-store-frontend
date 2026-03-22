"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSearchProducts } from "@/hooks/open/useSearchProducts";
import ProductCard from "@/components/open/products/ProductCard";
import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import FilterModal from "../../../components/open/filters/FilterModal";
import ProductCardSkeletonGrid from "@/components/open/loadings/ProductCardSkeletonGrid";
import { useTranslations } from "next-intl";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "./SearchPage.css";

export default function SearchPage() {
  const t = useTranslations("SearchPage");
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const { results, loading, hasMore, loadMore, search, filters, applyFilters } =
    useSearchProducts(query, 32, {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      sortBy,
      sortOrder,
    });

  useEffect(() => {
    if (query) { search(query); setSearchInput(query); }
  }, [query, search]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowHeader(y <= lastScrollY || y <= 10);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (loading) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) loadMore();
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, loadMore]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim())
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "recommend") {
      updateUrlWithFilters({ sortBy: "recommend", sortOrder: "desc" });
      applyFilters({ sortBy: "recommend", sortOrder: "desc" });
    } else {
      const [sb, so] = value.split("-");
      updateUrlWithFilters({ sortBy: sb, sortOrder: so });
      applyFilters({ sortBy: sb, sortOrder: so });
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    setOpenFilterModal(false);
    const f = {
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder,
      minPrice: newFilters.minPrice ? Number(newFilters.minPrice) : undefined,
      maxPrice: newFilters.maxPrice ? Number(newFilters.maxPrice) : undefined,
      categoryId: newFilters.categoryId ? Number(newFilters.categoryId) : undefined,
    };
    updateUrlWithFilters(f);
    applyFilters(f);
  };

  const updateUrlWithFilters = (newFilters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    newFilters.minPrice ? params.set("minPrice", newFilters.minPrice) : params.delete("minPrice");
    newFilters.maxPrice ? params.set("maxPrice", newFilters.maxPrice) : params.delete("maxPrice");
    newFilters.categoryId ? params.set("categoryId", newFilters.categoryId) : params.delete("categoryId");
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder) params.set("sortOrder", newFilters.sortOrder);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  if (loading && results.length === 0) {
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
          <div className="sp-search-row">
            <form onSubmit={handleSearch} className="sp-search-form">
              <Search size={16} className="sp-search-icon" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="sp-search-input"
              />
              <button type="submit" className="sp-search-btn" aria-label="Search">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
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
              <option className="bg-white dark:bg-black " value="recommend">{t("sortOptions.recommend")}</option>
              <option className="bg-white dark:bg-black " value="createdAt-desc">{t("sortOptions.newest")}</option>
              <option className="bg-white dark:bg-black " value="createdAt-asc">{t("sortOptions.oldest")}</option>
              <option className="bg-white dark:bg-black " value="price-asc">{t("sortOptions.priceLowHigh")}</option>
              <option className="bg-white dark:bg-black " value="price-desc">{t("sortOptions.priceHighLow")}</option>
            </select>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="sp-content">
          {results.length === 0 ? (

            /* Empty state */
            <div className="sp-empty">
              <Search size={48} className="sp-empty-icon" />
              <h2 className="sp-empty-title">{t("noResults.title")}</h2>
              <p className="sp-empty-sub">
                {t("noResults.message", { query })}
              </p>
              <Link href="/products" className="sp-empty-cta">
                {t("noResults.button")}
              </Link>
            </div>

          ) : (
            <>
              {/* Result count */}
              {query && (
                <p className="sp-result-meta">
                  <strong>{results.length}</strong> results for &ldquo;{query}&rdquo;
                </p>
              )}

              {/* Grid */}
              <div className="sp-grid">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={loadMoreRef} className="sp-sentinel">
                {loading && (
                  <div className="sp-loading-dots">
                    <span className="sp-loading-dot" />
                    <span className="sp-loading-dot" />
                    <span className="sp-loading-dot" />
                  </div>
                )}
                {!hasMore && results.length > 0 && (
                  <span className="sp-end-label">End of results</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

        <FilterModal
          isOpen={openFilterModal}
          onClose={() => setOpenFilterModal(false)}
          onApply={handleApplyFilters}
          currentFilters={{
            minPrice: filters.minPrice?.toString() || "",
            maxPrice: filters.maxPrice?.toString() || "",
            categoryId: filters.categoryId?.toString() || "",
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          }}
        />
      <ScrollToTop />
    </>
  );
}