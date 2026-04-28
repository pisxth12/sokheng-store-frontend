import {
  Order,
  OrderFilters,
  OrderListResponse,
  OrderStats,
  PageResponse,
} from "@/types/admin/order.type";
import apiClient from "../api/client";
import { downloadInvoice } from "@/app/(open)/actions/invoice.actions";

export const adminOrderApi = {
  // Get all orders with pagination
  getAllOrders: async (params?: OrderFilters) => {
    const response = await apiClient.get<PageResponse<OrderListResponse>>(
      "/admin/orders",
      { params },
    );
    return response.data;
  },
  // Get order stats
  getOrderStats: async () => {
    const response = await apiClient.get<OrderStats>("/admin/orders/stats");
    return response.data;
  },


  // Get orders by status
  getOrdersByStatus: async (status: string, params?: OrderFilters) => {
    const response = await apiClient.get<PageResponse<OrderListResponse>>(
      `/admin/orders/status/${status}`,
      { params },
    );
    return response.data;
  },

  // Search orders
  searchOrders: async (query: string, params?: OrderFilters) => {
    const response = await apiClient.get<PageResponse<OrderListResponse>>(
      "/admin/orders/search",
      {
        params: { q: query, ...params },
      },
    );
    return response.data;
  },

  // Get order details by ID
  getOrderById: async (orderId: number) => {
    const response = await apiClient.get<Order>(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: number, status: string) => {
    const response = await apiClient.patch<Order>(
      `/admin/orders/${id}/status`,
      { status },
    );
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: number) => {
    await apiClient.delete(`/admin/orders/${id}`);
  },

  downloadInvoice: async (orderNumber: string) => {
     const response = await apiClient.get(`/admin/orders/${orderNumber}/invoice`, {
      responseType: "blob",
    });
    return response.data;
  },
};
