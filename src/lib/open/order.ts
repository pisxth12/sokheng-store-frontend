import { Order, OrderPageResponse, TrackOrderResponse } from "@/types/open/order.type";
import apiClient from "../api/client";


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

  cancelOrder: async (orderNumber: string): Promise<void> => {
    const res = await apiClient.put(`/orders/${orderNumber}/cancel`);
    return res.data;
  },

  trackGuestOrder: async (data:{orderNumber:  string, email: string ,phone: string}): Promise<TrackOrderResponse>=> {
    const params = new URLSearchParams();
    params.set("orderNumber", data.orderNumber);
    params.set("email", data.email);
    params.set("phone", data.phone);
    const res = await apiClient.get(`/guest/orders/track?${params.toString()}`);
    return res.data;
  }
};
