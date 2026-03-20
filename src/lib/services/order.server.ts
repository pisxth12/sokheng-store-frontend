// lib/api/order.server.ts
import "server-only";
import { apiServerService } from "../api/server";

export async function getOrderCount(sessionId?: string): Promise<number> {
  
  try {
    const count = await apiServerService.get<number>("/orders/count", {
        sessionId
    });
    return count ?? 0;
  } catch {
    return 0;
  }
}