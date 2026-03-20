// lib/api/wishlist.server.ts
import "server-only";
import { apiServerService } from "../api/server";

export async function getWishlistCount(sessionId?: string): Promise<number>{
  try {
    const count = await apiServerService.get<number>("/wishlist/count", {
      sessionId
    });
    return count ?? 0;
  } catch {
    return 0;
  }
}
