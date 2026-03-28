// lib/api/order.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { OrderListResponse } from "@/types/admin/order.type";
import { Order } from "@/types/open/order.type";

export async function getOrderCount(): Promise<number> {  
  try {
    const { data: count } = await apiServerService.get<number>("/orders/count");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getOrders(page: number = 0, size: number = 10): Promise<OrderListResponse[]> {
  try {
    const { data: orders } = await apiServerService.get<OrderListResponse[]>(`/orders?page=${page}&size=${size}`, {
      cacheTime: 60,
    });
    return orders;
  } catch {
    return [];
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const { data } = await apiServerService.get<Order>(`/orders/number/${orderNumber}`,{
      cacheTime: 60,
    });
    return data ;
  } catch {
    console.error(`Error fetching order ${orderNumber}`);
    return null;
  }
}