"use client";

import DeleteOrderDialog from "@/components/admin/orders/DeleteOrderDialog";
import { useOrders } from "@/hooks/admin/useOrders";
import { OrderStatus } from "@/types/admin/order.type";
import { Eye, Trash2, Calendar, User, DollarSign, Tag } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refresh,
    deleteOrder,
    goToDetails,
  } = useOrders();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNumber, setDeleteNumber] = useState("");

  const handleStatusChange = (value: string) => {
    const validStatuses: OrderStatus[] = [
      "PENDING",
      "PROCESSING",
      "COMPLETED",
      "CANCELLED",
    ];
    if (validStatuses.includes(value as OrderStatus)) {
      updateFilters({ status: value as OrderStatus });
    } else {
      updateFilters({ status: undefined });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteOrder(deleteId);
      setDeleteId(null);
    } catch (error) {
      alert("Failed to delete order");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Orders</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage customer orders</p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={filters.search || ""}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded-lg"
        />

        <select
          value={filters.status || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 focus:border-black focus:outline-none transition-colors rounded-lg"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black animate-spin rounded-full" />
        </div>
      )}

      {/* Desktop Table View - Hidden on mobile */}
      {!loading && (
        <>
          <div className="hidden md:block border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-300">
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white ">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors overflow-x-scroll ">
                    <td className="px-4 py-4 font-medium text-xs text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-2 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => goToDetails(order.orderId)}
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    
                      <button
                        onClick={() => {
                          setDeleteId(order.orderId);
                          setDeleteNumber(order.orderNumber);
                        }}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View - Hidden on desktop */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{order.orderNumber}</span>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-700">{order.customerName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-semibold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => goToDetails(order.orderId)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => {
                        setDeleteId(order.orderId);
                        setDeleteNumber(order.orderNumber);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <button
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              className="px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:hover:border-gray-300 transition-colors rounded-lg text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:hover:border-gray-300 transition-colors rounded-lg text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteOrderDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        orderNumber={deleteNumber}
      />
    </div>
  );
}