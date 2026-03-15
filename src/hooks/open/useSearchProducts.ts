import { PageResponse, Product } from "@/types/open/product.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { publicProductApi } from "@/lib/open/products";

interface SearchFilters {
  sortBy?: string;
  sortOrder?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
}

interface UseSearchProductsReturn {
  //Data
  results: Product[];

  //State
  loading: boolean;
  hasMore: boolean;
  total: number;
  error: Error | null;

  //Search query
  query: string;
  setQuery: (query: string) => void;

  //Filters
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  applyFilters: (filters: SearchFilters) => void;

  //Pagination
  page: number;
  loadMore: () => void;
  reset: () => void;

  //Actions
  search: (searchQuery: string, newFilters?: SearchFilters) => Promise<void>;
  clear: () => void;
}

export const useSearchProducts = (
  initialQuery: string = "",
  pageSize: number = 32,
  initialFilters: SearchFilters = {},
): UseSearchProductsReturn => {
  const [results, setResults] = useState<Product[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialLoadRef = useRef(false);

  // ============== MAIN SEARCH ==============
  const performSearch = useCallback(
    async (
      searchQuery: string,
      pageNum: number = 0,
      isNewSearch: boolean = false,
      currentFilters: SearchFilters = filters,
    ) => {
      if (!searchQuery.trim()) {
        if (isNewSearch) setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response: PageResponse<Product> =
          await publicProductApi.searchProducts(
            searchQuery,
            pageNum,
            pageSize,
            currentFilters.sortBy,
            currentFilters.sortOrder,
            currentFilters.minPrice,
            currentFilters.maxPrice,
            currentFilters.categoryId,
          );

        setResults((prev) => {
          if (isNewSearch || pageNum === 0) {
            return response.content;
          }

          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = response.content.filter(
            (p) => !existingIds.has(p.id),
          );
          return [...prev, ...newProducts];
        });

        setHasMore(!response.last);
        setTotal(response.totalElements);
        setPage(pageNum + 1);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load products"),
        );
      } finally {
        setLoading(false);
      }
    },
    [pageSize, filters],
  );

  // ============== APPLY FILTERS ==============
  const applyFilters = useCallback(
    async (newFilters: SearchFilters) => {
      setFilters(newFilters);
      setResults([]);
      setPage(0);
      setHasMore(true);
      await performSearch(query, 0, true, newFilters);
    },
    [query, performSearch],
  );

  // ============== ACTIONS ==============
  const search = useCallback(
    async (searchQuery: string, newFilters?: SearchFilters) => {
      setQuery(searchQuery);
      if (newFilters) setFilters(newFilters);
      setResults([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      await performSearch(searchQuery, 0, true, newFilters || filters);
    },
    [performSearch, filters],
  );

  const loadMore = useCallback(async () => {
    if (!loading && hasMore && query) {
      await performSearch(query, page, false);
    }
  }, [loading, hasMore, query, page, performSearch]);

  const reset = useCallback(() => {
    setResults([]);
    setQuery("");
    setFilters({});
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  const clear = useCallback(() => {
    reset();
  }, [reset]);

  // ============== INITIAL SEARCH ==============
  useEffect(() => {
    if (!initialLoadRef.current && initialQuery) {
      initialLoadRef.current = true;
      search(initialQuery, initialFilters);
    }
  }, [initialQuery, initialFilters, search]);

  return {
    // Data
    results,

    // States
    loading,
    hasMore,
    total,
    error,

    // Search query
    query,
    setQuery,

    // Filters
    filters,
    setFilters,
    applyFilters,

    // Pagination
    page,
    loadMore,
    reset,

    // Actions
    search,
    clear,
  };
};
