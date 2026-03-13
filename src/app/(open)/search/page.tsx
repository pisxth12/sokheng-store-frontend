"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSearchProducts } from "@/hooks/open/useSearchProducts";
import ProductCard from "@/components/open/products/ProductCard";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search as SearchIcon, Search, Filter } from "lucide-react";
import Link from "next/link";
import FilterModal from "../../../components/open/searchs/FilterModal";
import ProductCardSkeletonGrid from "@/components/open/loadings/ProductCardSkeletonGrid";
import { useTranslations } from "next-intl";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function SearchPage() {
  const t = useTranslations('SearchPage'); 
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
   const loadMoreRef = useRef<HTMLDivElement>(null);


  // Get filter values from URL
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const {
    results,
    loading,
    hasMore,
    loadMore,
    search,
    filters,
    applyFilters
  } = useSearchProducts(query, 32, {
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    sortBy,
    sortOrder
  });

  useEffect(() => {
    if (query) {
      search(query);
      setSearchInput(query);
    }
  }, [query, search]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

    // Infinite scroll setup
     useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === "recommend") {
      updateUrlWithFilters({ sortBy: "recommend", sortOrder: "desc" });
      applyFilters({ sortBy: "recommend", sortOrder: "desc" });
    } else {
      const [newSortBy, newSortOrder] = value.split('-');
      updateUrlWithFilters({ sortBy: newSortBy, sortOrder: newSortOrder });
      applyFilters({ sortBy: newSortBy, sortOrder: newSortOrder });
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    const filtersToApply = {
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder,
      minPrice: newFilters.minPrice ? Number(newFilters.minPrice) : undefined,
      maxPrice: newFilters.maxPrice ? Number(newFilters.maxPrice) : undefined,
      categoryId: newFilters.categoryId ? Number(newFilters.categoryId) : undefined
    };
    
    updateUrlWithFilters(filtersToApply);
    applyFilters(filtersToApply);
  };

  const updateUrlWithFilters = (newFilters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
    else params.delete("minPrice");
    
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
    else params.delete("maxPrice");
    
    if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId.toString());
    else params.delete("categoryId");
    
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder) params.set("sortOrder", newFilters.sortOrder);
    
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  if (loading && results.length === 0) {
    return (
      <div className="container mt-40 mx-auto  py-8">
      <ProductCardSkeletonGrid count={20} />
    </div>
    );
  }

  return (
    <>
      <div className="min-h-screen ">
        {/* Search Header */}
        <div
          className={` max-w-primary px-4 shadow-md sticky dark:bg-darkbg bg-white top-15 z-10   transition-transform duration-300 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className=" mx-auto ">
            <form onSubmit={handleSearch} className="py-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 border-b border-slate-400  flex items-center rounded-g py-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                     placeholder={t('searchPlaceholder')} 
                    className="w-full outline-none text-lg "
                  />
                  <button type="submit" className="ml-2">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-between   py-5">
          <button 
            onClick={() => setOpenFilterModal(true)} 
            className="flex justify-between gap-2 items-center px-3 border-2 py-1 rounded-sm"
          >
            <Filter /> 
            <span>
              {t('filters')}
            </span>
          </button>

           <select 
              className="border-2 p-1 rounded-sm bg-transparent" 
              value={filters.sortBy === "recommend" ? "recommend" : `${filters.sortBy}-${filters.sortOrder}`}
              onChange={handleSortChange}
            >
              <option className="dark:bg-darkbg" value="recommend">{t('sortOptions.recommend')}</option>
              <option className="dark:bg-darkbg" value="createdAt-desc">{t('sortOptions.newest')}</option>
              <option className="dark:bg-darkbg" value="createdAt-asc">{t('sortOptions.oldest')}</option>
              <option className="dark:bg-darkbg" value="price-asc">{t('sortOptions.priceLowHigh')}</option>
              <option className="dark:bg-darkbg" value="price-desc">{t('sortOptions.priceHighLow')}</option>
            </select>
        </div>
      </div>

        

        {/* Main Content */}
        <div className="max-w-primary mx-auto py-8">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">{t('noResults.title')}</h2>
              <p className="text-gray-500 mb-6">
                 {t('noResults.message', { query })}
              </p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg"
              >
                {t('noResults.button')}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

               {/* Loading indicator and observer target */}
              <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
                {loading && (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                )}
                {!hasMore && results.length > 0 && (
                  <p className="text-sm text-gray-400">{t('noMoreProducts')}</p>
                )}
              </div>
             
            </>
          )}
        </div>
      </div>

      {openFilterModal && (
        <FilterModal 
          isOpen={openFilterModal} 
          onClose={() => setOpenFilterModal(false)}
          onApply={handleApplyFilters}
          currentFilters={{
            minPrice: filters.minPrice?.toString() || "",
            maxPrice: filters.maxPrice?.toString() || "",
            categoryId: filters.categoryId?.toString() || "",
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder
          }}
        />
      )}
      <ScrollToTop/>
    </>
  );
}