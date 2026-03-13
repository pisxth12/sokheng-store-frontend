"use client";

import DeleteOrderDialog from "@/components/admin/orders/DeleteOrderDialog";
import { useOrders } from "@/hooks/admin/useOrders";
import { OrderStatus } from "@/types/admin/order.type";
import { Eye, CheckCircle, Trash2 } from "lucide-react";
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
    changePageSize,
    refresh,
    deleteOrder,
    updateOrderStatus,
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

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
    } catch (error) {
      alert("Failed to update status");
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage customer orders</p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-80 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          />

          <select
            value={filters.status || ""}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 focus:border-black focus:outline-none transition-colors"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {pagination.totalElements} orders
          </span>
          <select
            value={pagination.pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black animate-spin" />
        </div>
      ) : (
        <div className="border border-gray-300">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => goToDetails(order.id)}
                      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  
                    <button
                      onClick={() => {
                        setDeleteId(order.id);
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
      )}

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              className="px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
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
