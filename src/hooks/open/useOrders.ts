import { publicOrderApi } from "@/lib/open/order";
import { Order } from "@/types/open/order.type";
import { use, useCallback, useEffect, useState } from "react";

export interface UserOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;

  //Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;

  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;

  //Actions
  refreshOrders: () => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
}

export const useOrders = (initialPageSize: number = 10): UserOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  //Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(initialPageSize);

  //Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicOrderApi.getMyOrders(currentPage, pageSize);
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load orders"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages],
  );

  const goToNextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canGoNext]);

  const goToPrevPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canGoPrevious]);

  //Action
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = useCallback(
    async (orderId: number) => {
      try {
        setLoading(true);
        setError(null);
        await publicOrderApi.cancelOrder(orderId);
        await refreshOrders();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to cancel order"),
        );
      } finally {
        setLoading(false);
      }
    },
    [refreshOrders],
  );

  return {
    // Data
    orders,
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    goToPage,
    goToNextPage,
    goToPrevPage,
    canGoNext,
    canGoPrevious,

    // Actions
    refreshOrders,
    cancelOrder,
  };
};
