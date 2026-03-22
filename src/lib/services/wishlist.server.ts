// lib/api/wishlist.server.ts
import "server-only";
import { apiServerService } from "../api/server";

export async function getWishlistCountForUser(token?: string): Promise<number> {
  try {
    const count = await apiServerService.get<number>("/wishlist/count", {
      token,
    });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getWishlistCountForGuest(sessionId:string) {
  try {
    const count = await apiServerService.get<number>("/wishlist/count", {
      sessionId,
    });
    return count ?? 0;
  } catch {
    return 0;
  }
}