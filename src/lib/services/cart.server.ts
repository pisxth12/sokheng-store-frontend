import "server-only";
import { CartResponse } from "@/types/open/cart.type";
import { apiServerService } from "../api/server";
import { CACHE_TIME } from "../config/constants";

export async function getServerCartCount(sessionId?: string): Promise<number> {
  try {
    const count = await apiServerService.get<number>("/cart/count", {
      sessionId,
    });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getServerCart(
  sessionId?: string,
): Promise<CartResponse | null> {
  try {
    return await apiServerService.get<CartResponse>("/cart", {
      sessionId,
      cacheTime: CACHE_TIME.CART,
    });
  } catch {
    return null;
  }
}
