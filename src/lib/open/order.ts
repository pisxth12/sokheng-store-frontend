import { OrderPageResponse } from "@/types/open/order.type";
import apiClient from "../api/client";
import { Order } from "@/types/admin/order.type";

export const publicOrderApi = {
  getMyOrders: async (page = 0, size = 10): Promise<OrderPageResponse> => {
    const res = await apiClient.get<OrderPageResponse>(
      `/orders?page=${page}&size=${size}`,
    );
    return res.data;
  },

  getOrderNumber: async (orderNumber: string): Promise<Order> => {
    const res = await apiClient.get(`/orders/number/${orderNumber}`);
    return res.data;
  },

  cancelOrder: async (orderNumber: number): Promise<void> => {
    await apiClient.put(`/${orderNumber}/cancel`);
  },
};
