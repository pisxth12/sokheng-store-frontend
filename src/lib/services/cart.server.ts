import "server-only";
import { CartResponse } from "@/types/open/cart.type";
import { apiServerService } from "../api/server";

export async function getCartCountForUser(token: string): Promise<number> {
  try {
    const response = await apiServerService.get<number>("/cart/count", { token });
    return response ?? 0;
  } catch (error) {
    console.error("Error fetching cart count for user:", error);
    return 0;
  }
}

export async function getCartCountForGuest(sessionId: string): Promise<number> {
  try {
    const response = await apiServerService.get<number>("/cart/count", { sessionId });
    return response ?? 0;
  } catch (error) {
    console.error("Error fetching cart count for guest:", error);
    return 0;
  }
}



export async function getServerCart(
  token?: string,
  sessionId?: string,
): Promise<CartResponse | null> {
  try {
    const options = token ? { token } : { sessionId };
    return await apiServerService.get<CartResponse>("/cart", options);
  } catch {
    return null;
  }
}
