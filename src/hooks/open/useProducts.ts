import { PageResponse, Product } from "@/types/open/product.type";
import { useCallback, useEffect, useRef, useState } from "react";

interface UserProductsReturn {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  total: number;
  error: Error | null;
  loadMore: () => void;
  reset: () => void;
}

export const useProducts = (
    fetchFn: (page: number) => Promise<PageResponse<Product>>,
): UserProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialLoadRef = useRef(false);

  const load = useCallback(
    async (pageNum: number, isReset = false): Promise<void> => {
      if ((loading && !isReset) || (!hasMore && !isReset)) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFn(pageNum);
        setProducts((prev) => {
          if (isReset) return response.content;
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = response.content.filter(
            (p) => !existingIds.has(p.id),
          );
          return [...prev, ...newProducts];
        });
        setHasMore(!response.last);
        setTotal(response.totalElements);
        setPage((prev) => (isReset ? 1 : prev + 1));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load products"),
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, loading, hasMore],
  );

  const loadMore = useCallback(async (): Promise<void> => {
    if (!loading && hasMore) {
      await load(page);
    }
  }, [loading, hasMore, page, load]);

  const reset = useCallback(async (): Promise<void> => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    await load(0, true);
  }, []);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      load(0, true);
    }
  }, [load]);

  return {
    products,
    loading,
    hasMore,
    total,
    error,
    loadMore,
    reset,
  };
};
