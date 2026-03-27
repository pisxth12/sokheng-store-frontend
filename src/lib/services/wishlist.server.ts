// lib/api/wishlist.server.ts
import "server-only";
import { apiServerService } from "../api/server";
import { cookies } from "next/headers";


export async function getWishlistCounts(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const sessionId = cookieStore.get("cartSessionId")?.value; 
    
    if (!token && !sessionId) {
      return 0;
    }
    const options = token ? { token } : { sessionId };
    const count = await apiServerService.get<number>("/wishlist/count", options);
    return count ?? 0;
  } catch {
    return 0;
  }
}

