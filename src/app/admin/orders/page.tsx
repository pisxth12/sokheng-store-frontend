'use client';

import OrderFilters from '@/components/admin/orders/OrderFilters';
import OrderPagination from '@/components/admin/orders/OrderPagination';
import OrderSearchBar from '@/components/admin/orders/OrderSearchBar';
import OrderTable from '@/components/admin/orders/OrderTable';
import { useOrders } from '@/hooks/admin/useOrders';

import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    changePageSize,
    refresh
  } = useOrders();

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <OrderSearchBar 
          onSearch={(query) => updateFilters({ search: query })}
          initialValue={filters.search}
        />
        <OrderFilters 
          currentStatus={filters.status}
          onStatusChange={(status) => updateFilters({ status })}
          onClear={refresh}
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <OrderTable orders={orders} />
          
          {/* Pagination */}
          <OrderPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalElements={pagination.totalElements}
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
          />
        </>
      )}
    </div>
  );
}