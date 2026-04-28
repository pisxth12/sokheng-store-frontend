import { useState, useCallback, useEffect } from "react";
import { adminOrderApi } from "@/lib/admin/orders";
import { useRouter } from "next/navigation";
import {
  OrderFilters,
  OrderListResponse,
  PageResponse,
  Order,
  OrderStats,
} from "@/types/admin/order.type";

export const useOrders = (initialFilters?: OrderFilters) => {
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<OrderFilters>(initialFilters || {});

  const router = useRouter();

   // Helper function to extract error message
  const extractErrorMessage = (err: any): string => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err.response?.data?.error) {
      return err.response.data.error;
    }
    if (err.message) {
      return err.message;
    }
    return "An unexpected error occurred";
  };


  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
       const [ordersResponse, statsData] = await Promise.all([
        filters.search 
          ? adminOrderApi.searchOrders(filters.search, filters)
          : filters.status 
            ? adminOrderApi.getOrdersByStatus(filters.status, filters)
            : adminOrderApi.getAllOrders(filters),
        adminOrderApi.getOrderStats()
      ]);

      setOrders(ordersResponse.content);
      setPagination({
        totalPages: ordersResponse.totalPages,
        totalElements: ordersResponse.totalElements,
        currentPage: ordersResponse.number,
        pageSize: ordersResponse.size,
      });
      setStats(statsData);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single order by ID
  const fetchOrderById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminOrderApi.getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(
    async (id: number, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await adminOrderApi.updateOrderStatus(id, status);
        setOrder(updated);
        // Refresh list if on orders page
        if (window.location.pathname === "/admin/orders") {
          fetchOrders();
        }
        return updated;
      } catch (err: any) {
       setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders],
  );

  // Delete order
 

  const downloadInvoice = useCallback( async (orderNumber: string) => {
     setError(null);
     setLoading(true);
     try{
      const response = await adminOrderApi.downloadInvoice(orderNumber);
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (err: any) {
    setError(extractErrorMessage(err));
  } finally {
    setLoading(false);
  }     
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);



  // Refresh data
  const refresh = useCallback(() => {
    if (
      window.location.pathname.includes("/admin/orders/") &&
      window.location.pathname !== "/admin/orders"
    ) {
      // On details page, refresh order
      const id = parseInt(window.location.pathname.split("/").pop() || "0");
      if (id) fetchOrderById(id);
    } else {
      // On list page, refresh orders
      fetchOrders();
    }
  }, [fetchOrders, fetchOrderById]);

  // Auto fetch on mount and filter changes
  useEffect(() => {
    if (window.location.pathname === "/admin/orders") {
      fetchOrders();
    }
  }, [filters]);

  return {
    // State
    orders,
    order,
    loading,
    error,
    pagination,
    filters,
    stats,
    downloadInvoice,

    // Actions
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    updateFilters,
    changePage,
    changePageSize,
    clearFilters,
    refresh,

    // Utils
    goToDetails: (id: number) => router.push(`/admin/orders/${id}`),
    goToEdit: (id: number) => router.push(`/admin/orders/${id}/edit`),
  };
};
