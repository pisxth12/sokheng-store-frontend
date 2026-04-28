// lib/api/wishlist.server.ts
import "server-only";
import { apiServerService } from "../api/server";


export async function getWishlistCounts(): Promise<number> {
  try {
  
    const { data: count } = await apiServerService.get<number>("/wishlist/count");
    return count ?? 0 ;
  } catch {
    return 0;
  }
} 

