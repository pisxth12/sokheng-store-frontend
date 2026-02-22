import { useState, useCallback, useEffect } from 'react';
import { adminOrderApi } from '@/lib/api/admin/orders';
import { useRouter } from 'next/navigation';
import { OrderFilters, OrderListResponse, PageResponse, Order} from '@/types/order.type';

export const useOrders = (initialFilters?: OrderFilters) => {
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState<OrderFilters>(initialFilters || {});

  const router = useRouter();

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response: PageResponse<OrderListResponse>;
      
      if (filters.search) {
        response = await adminOrderApi.searchOrders(filters.search, filters);
      } else if (filters.status) {
        response = await adminOrderApi.getOrdersByStatus(filters.status, filters);
      } else {
        response = await adminOrderApi.getAllOrders(filters);
      }
      
      setOrders(response.content);
      setPagination({
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number,
        pageSize: response.size
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
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
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (id: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await adminOrderApi.updateOrderStatus(id, status);
      setOrder(updated);
      // Refresh list if on orders page
      if (window.location.pathname === '/admin/orders') {
        fetchOrders();
      }
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  // Delete order
  const deleteOrder = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await adminOrderApi.deleteOrder(id);
      // Refresh list
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to delete order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 0 })); // Reset to first page
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((size: number) => {
    setFilters(prev => ({ ...prev, size, page: 0 }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    if (window.location.pathname.includes('/admin/orders/') && window.location.pathname !== '/admin/orders') {
      // On details page, refresh order
      const id = parseInt(window.location.pathname.split('/').pop() || '0');
      if (id) fetchOrderById(id);
    } else {
      // On list page, refresh orders
      fetchOrders();
    }
  }, [fetchOrders, fetchOrderById]);

  // Auto fetch on mount and filter changes
  useEffect(() => {
    if (window.location.pathname === '/admin/orders') {
      fetchOrders();
    }
  }, [fetchOrders, filters]);

  return {
    // State
    orders,
    order,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    deleteOrder,
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